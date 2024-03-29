/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * This is a special transcode feature to transcode files to gifs
 * It represents a mix between a regular feature and a format, as a special format
 */

import FFmpegFeature from '@features/FFmpegFeature'
import CluiStore from '@store/cluiStore'
import React, { useEffect, useState } from 'react'

const { updateConfiguration } = CluiStore

export type GIFConfiguration = {
  TRANSCODE: {
    FORMAT: {
      CONFIG: { fps: number; loop: number; scale: number }
      value: 'GIF'
      [name: string]: any
    }
  }
  [name: string]: any
}

class GIFTranscode extends FFmpegFeature {
  configuration: GIFConfiguration

  constructor(configuration: GIFConfiguration) {
    super()
    this.configuration = configuration
    this.changeFileExtension('.gif')
    const { fps, loop, scale } = this.parseConfiguration()
    this.setFFmpegCommands(fps, loop, scale)
  }

  setFFmpegCommands = (fps = 10, loop = 0, scale = 320) => {
    // Command from https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality
    this.ffmpegCommands = `-vf "fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop ${loop}`
  }

  parseConfiguration = () => {
    const { configuration } = this
    const { FORMAT } = configuration.TRANSCODE
    const { CONFIG } = FORMAT
    const { fps, loop, scale } = CONFIG
    return { fps, loop, scale }
  }

  setProgress = () => {
    this.progressBar.name = 'Making a gif?'
    this.progressBar.color = '#0d6efd'
  }

  setFileConfig = () => {
    this.fileConfig = {
      types: [{ name: 'video', number: { min: 1, max: 1 } }],
      primaryType: 'video'
    }
  }
}

export default GIFTranscode

const GIFUi = ({ parents }: { parents: string[] }) => {
  const [fps, setFps] = useState(10)
  const [scale, setScale] = useState(320)
  const [loop, setLoop] = useState(0)

  useEffect(() => {
    updateConfiguration(
      {
        fps,
        scale,
        loop,
        value: 'dummy'
      },
      [...parents, 'CONFIG']
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fps, scale, loop])

  return (
    <div className="py-3 overflow-x-hidden">
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="fps">
            fps (Frames per second)
          </label>
          <input
            value={fps}
            onChange={e => {
              setFps(parseFloat(e.target.value))
            }}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="fps"
            type="number"
            placeholder="10"
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="scale">
            Width
          </label>
          <input
            value={scale}
            onChange={e => {
              setScale(parseFloat(e.target.value))
            }}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="scale"
            type="number"
            placeholder="320"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="loop">
            Loops (0 - Infinite, -1 No Loop)
          </label>
          <input
            value={loop}
            onChange={e => {
              setLoop(parseInt(e.target.value))
            }}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="loop"
            type="number"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )
}

export { GIFUi }
