import FFmpegFeature from '@features/FFmpegFeature'
import React, { useEffect, useState } from 'react'

import ComponentStore from '../../store/componentStore'

const {
  CluiStore: { updateConfiguration }
} = ComponentStore

type VideoSpeedConfig = {
  VIDEO_SPEED: {
    value: number
    audio: { value: boolean }
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
      VIDEO_SPEED: { value, audio }
    } = this.configuration
    return {
      factor: value,
      audio: audio.value
    }
  }

  setProgress = () => {
    const { factor } = this.parseConfiguration()
    this.progressBar.name = factor > 1.0 ? 'Speeding up...' : 'Slowing down...'
    this.progressBar.color = '#3FBD71'
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

export const VideoSpeedUI = ({ parents }: { parents: Array<string> }) => {
  const [affectAudio, setAffectAudio] = useState<boolean>(false)
  const [factor, setFactor] = useState<number>(2.0)
  const [input, setInput] = useState<string>('2.0')
  const [valid, setValid] = useState<boolean>(true)

  const validInputs = Array.from(
    Array(10),
    (_val: any, idx: number) => idx + ''
  ).concat('.')

  useEffect(() => {
    if (isNaN((input as unknown) as number) || input === '') {
      setValid(false)
    } else {
      setValid(true)
      setFactor(parseFloat(input))
    }
  }, [input])

  useEffect(() => {
    updateConfiguration(
      {
        value: factor,
        audio: { value: affectAudio }
      },
      [...parents]
    )
  }, [affectAudio, factor, parents])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.value === '') {
      console.log('bingo')
      setInput('')
      setValid(false)
      return
    }
    if (
      !e.target.value
        .split('')
        .every((val: string) => validInputs.includes(val))
    )
      return
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <p className="text-xl font-bold">Video Speed Settings</p>

      <div className="flex flex-col justify-left items-left">
        <div className="flex items-left p-8">
          <p className="h-full mr-4">Apply to audio?</p>
          <input
            className="bg-gray-700 bg-opacity-50"
            type="checkbox"
            onChange={e => setAffectAudio(!!e.target.value)}
          />
        </div>
        <div className="flex items-left p-8">
          <p className="h-full mr-4">Multiplier</p>
          <input
            className={`input-like-text w-16 appearance-none block text-gray-200  focus:text-gray-50 bg-gray-700  bg-opacity-50 rounded py-3 px-4 mb-3 leading-tight focus:outline-none ${
              valid
                ? 'focus:border-green-300 focus:ring-green-300'
                : 'focus:border-red-600 focus:ring-red-600'
            } focus:ring-opacity-40 focus:ring-2 focus:bg-opacity-75`}
            type="text"
            value={input}
            onChange={e => handleInputChange(e)}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoSpeedFeature
