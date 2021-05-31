import { Atlantis, Trim } from '@modfy/react-video-components'
import workflowStore from '@store/workflowStore'
import { observer } from 'mobx-react'
import React, { useMemo } from 'react'

import ComponentStore from '../../store/componentStore'
import { hmsToTimeStamp, secondsToTime } from '../../ts/time'
import FFmpegFeature from '../FFmpegFeature'

const { CluiStore, FileStore } = ComponentStore

const { updateConfiguration } = CluiStore

type TrimConfig = {
  TRIM: { START: { value: number }; STOP: { value: number }; value: number }
  [name: string]: any
}

class TrimFeature extends FFmpegFeature {
  configuration: TrimConfig

  constructor(configuration: TrimConfig) {
    super()
    this.configuration = configuration
    const { start, stop } = this.parseConfiguration()
    this.setFFmpegCommands(start, stop)
    this.setProgress()
    this.setFileConfig()
  }

  parseConfiguration = () => {
    const { TRIM } = this.configuration
    const { START, STOP } = TRIM
    return { start: START.value, stop: STOP.value }
  }

  setProgress = () => {
    this.progressBar.name = 'Trimming ...'
    this.progressBar.color = '#3FBD71'
  }

  setFileConfig = () => {
    this.fileConfig = {
      types: [{ name: 'video', number: { min: 1, max: 1 } }],
      primaryType: 'video'
    }
  }

  setFFmpegCommands = (start: number, end: number) => {
    const startTime = hmsToTimeStamp(secondsToTime(start))
    const endTime = hmsToTimeStamp(secondsToTime(end))

    this.ffmpegCommands = `-ss ${startTime} -to ${endTime} -c copy`
  }
}

export default TrimFeature

const TrimUi = ({ parents }: { parents: Array<string> }) => {
  const { files } = FileStore

  const { video } = files

  const { updateWorkflow, updateModalState } = workflowStore

  const url = useMemo(
    () =>
      video && video?.length > 0 ? URL.createObjectURL(video![0].file) : '',
    [video]
  )

  if (!video || video?.length === 0) {
    return <div>Please upload a video to start </div>
  } else {
    return (
      <Trim
        src={url}
        theme={Atlantis}
        type="other"
        callback={(start, end) => {
          updateConfiguration(
            {
              START: { value: start },
              STOP: { value: end },
              value: end - start
            },
            [...parents]
          )
          updateWorkflow('TRIM')
          updateModalState(false)
        }}></Trim>
    )
  }
}

const observerTrim = observer(TrimUi)

export { observerTrim as TrimUi }
