import List from '@cluiComponents/List'
import SingleInput from '@cluiComponents/Single-Input'
import FFmpegFeature from '@features/FFmpegFeature'
import useExistingSettings from '@features/useExistingSettings'
import cluiStore from '@store/cluiStore'
import React, { useEffect, useState } from 'react'

type VideoSpeedConfig = {
  VIDEO_SPEED: {
    value: number
    AUDIO: { value: boolean }
  }
  [name: string]: any
}

class VideoSpeedFeature extends FFmpegFeature {
  configuration: VideoSpeedConfig

  constructor(configuration: VideoSpeedConfig) {
    super()
    this.configuration = configuration
    const { factor, audio } = this.parseConfiguration()
    this.setFFmpegCommands(factor, audio)
    this.setProgress()
    this.setFileConfig()
  }

  parseConfiguration = () => {
    const {
      VIDEO_SPEED: {
        value,
        AUDIO: { value: audioValue }
      }
    } = this.configuration
    return {
      factor: value,
      audio: audioValue
    }
  }

  setProgress = () => {
    const { factor } = this.parseConfiguration()
    this.progressBar.name = factor > 1.0 ? 'Speeding up...' : 'Slowing down...'
    this.progressBar.color = '#3FBD71'
    this.progressBar.multipler = factor
  }

  setFFmpegCommands = (factor: number, audio?: boolean) => {
    if (factor === 1.0) return
    if (audio) {
      this.ffmpegCommands = `-filter_complex "[0:v]setpts=${
        1 / factor
      }*PTS[v];[0:a]atempo=${factor}[a]" -map "[v]" -map "[a]"`
    } else {
      this.ffmpegCommands = `-filter:v "setpts=PTS*${1 / factor}"`
    }
  }

  setFileConfig = () => {
    this.fileConfig = {
      types: [{ name: 'video', number: { min: 1, max: 1 } }],
      primaryType: 'video'
    }
  }
}

const { updateConfiguration } = cluiStore

const ApplyToAudio = ({
  parents,
  startState = false
}: {
  parents: string[]
  startState: boolean
}) => {
  const [affectAudio, setAffectAudio] = useState(startState)

  useEffect(() => {
    console.info('Updated state', affectAudio, parents)
    if (parents.length > 0) {
      updateConfiguration({ value: affectAudio }, [...parents])
    }
  }, [affectAudio, parents])

  return (
    <div className="py-3 pt-6 flex justify-center items-center">
      <p className="text-lg text-gray-50 px-10">
        Apply to speed change to audio?
      </p>
      <input
        type="checkbox"
        checked={affectAudio}
        onChange={e => setAffectAudio(e.target.checked)}></input>
    </div>
  )
}

export const VideoSpeedUI = ({ parents }: { parents: Array<string> }) => {
  const presets = {
    main: {
      key: 'VIDEO_SPEED',
      value: 0.5
    },
    child: {
      key: 'AUDIO',
      value: false
    }
  }

  const defaults = useExistingSettings({
    main: [...parents],
    child: [...parents, 'AUDIO'],
    defaults: presets
  })

  const { main, child } = defaults

  const AudioSelectionChild = {
    component: ApplyToAudio,
    props: {
      parents: [...parents, 'AUDIO'],
      startState: child?.value
    }
  }

  const customObject = {
    name: 'Custom',
    value: 0,
    child: {
      component: SingleInput,
      props: {
        parents,
        type: 'number',
        placeholder: 1.5,
        child: AudioSelectionChild
      },
      paddingTop: 3
    }
  }

  const ListElements = [
    { name: '0.25x', value: 0.25, child: AudioSelectionChild },
    { name: '0.5x', value: 0.5, child: AudioSelectionChild },
    { name: '1.5x', value: 1.5, child: AudioSelectionChild },
    { name: '2x', value: 2, child: AudioSelectionChild },
    customObject
  ]

  const listObject = ListElements.find(({ value }) => value === main.value)

  const current = listObject || {
    ...customObject,
    child: {
      ...customObject.child,
      props: {
        ...customObject.child?.props,
        defaultValue: main.value // Sets the custom input value to the preset value
      }
    }
  }

  const props = {
    parents,
    title: 'Speed Settings',
    current,
    list: ListElements
  }

  return <List {...props} />
}

export default VideoSpeedFeature
