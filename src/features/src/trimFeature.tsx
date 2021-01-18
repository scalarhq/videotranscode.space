import { observer } from 'mobx-react'
import React, { useEffect, useReducer, useState } from 'react'
import { RangeSlider } from 'reactrangeslider'

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

type TrimValues = {
  start: number
  end: number
}

const TrimActions = {
  updateStart: 'updateStart',
  updateEnd: 'updateEnd'
}

const trimReducer = (
  state: TrimValues,
  { type, start, end }: { type: string; start?: number; end?: number }
) => {
  console.info(type, start, end)
  switch (type) {
    case TrimActions.updateStart:
      return Object.assign({}, state, { start })
    case TrimActions.updateEnd:
      return Object.assign({}, state, { end })
    default:
      return state
  }
}

const TrimUi = ({ parents }: { parents: Array<string> }) => {
  const { files } = FileStore

  const { video } = files

  const [value, dispatch] = useReducer(trimReducer, { start: 0, end: 100 })

  const [max, setMax] = useState(
    files.video ? Math.ceil(files.video[0].videoMetadata?.duration || 100) : 100
  )

  useEffect(() => {
    console.info('Setting video defaults')
    if (video && video[0]) {
      const end = Math.ceil(video[0].videoMetadata?.duration || 100)

      dispatch({ type: TrimActions.updateEnd, end: end })

      setMax(end)
    }
  }, [video])

  useEffect(() => {
    console.info('Update value', value)
    updateConfiguration(
      {
        START: { value: value.start },
        STOP: { value: value.end },
        value: value.end - value.start
      },
      [...parents]
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const styles = {
    slider: {
      height: '3rem',
      userDrag: 'none',
      userSelect: 'none'
    },
    trackStyle: {
      height: 5,
      border: '3px solid black',
      backgroundColor: '#6c63ff',
      top: 14,
      userDrag: 'none',
      userSelect: 'none'
    },
    highlightedTrackStyle: {
      height: 5,
      border: '3px solid #6c63ff',
      backgroundColor: '#6c63ff',
      top: 14,
      userDrag: 'none',
      userSelect: 'none'
    },
    handleStyle: {
      height: 30,
      width: 30,
      border: '3px solid black',
      backgroundColor: '#3FBD71',
      outline: 'none',
      userDrag: 'none',
      userSelect: 'none'
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <p className="text-xl font-bold">Trim Settings</p>
      <div className="range-slider-wrapper flex w-full">
        <div className=" w-1/4 flex flex-col items-center">
          <p className="text-m font-bold select-none">
            {(() => hmsToTimeStamp(secondsToTime(value.start)))()}
          </p>
          <button
            type="button"
            className="items-center w-1/2 py-2 mt-4 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none">
            Edit
          </button>
        </div>
        <div className="range-wrapper w-1/2">
          <RangeSlider
            value={value}
            step={1}
            min={0}
            max={max}
            onChange={({ start, end }: { start: number; end: number }) => {
              console.info('Changed value', start, end)
              if (start !== value.start && Math.abs(value.start - start) < 8) {
                dispatch({
                  type: TrimActions.updateStart,
                  start: start
                })
              }
              if (
                end !== value.end &&
                end !== max &&
                Math.abs(value.end - end) < 8
              ) {
                dispatch({
                  type: TrimActions.updateEnd,
                  end: end
                })
              }
            }}
            wrapperStyle={styles.slider}
            trackStyle={styles.trackStyle}
            highlightedTrackStyle={styles.highlightedTrackStyle}
            handleStyle={styles.handleStyle}
            hoveredHandleStyle={styles.handleStyle}
            focusedHandleStyle={styles.handleStyle}
            activeHandleStyle={styles.handleStyle}
          />
        </div>
        <div className="flex flex-col items-center w-1/4 ">
          <p className="text-m font-bold select-none">
            {(() => hmsToTimeStamp(secondsToTime(value.end)))()}
          </p>

          <button
            type="button"
            className="items-center w-1/2 py-2 mt-4 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

const observerTrim = observer(TrimUi)

export { observerTrim as TrimUi }
