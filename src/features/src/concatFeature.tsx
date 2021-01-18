import electron, { isElectron } from '@core/electron'
import ffmpeg from '@core/ffmpeg'
import React from 'react'

import { FileString } from '~@types/fileTypes'

import FFmpegFeature from '../FFmpegFeature'
import TranscodeFeature, {
  TranscodeConfig,
  TranscodeUi
} from './transcodeFeature'

class ConcatFeature extends FFmpegFeature {
  configuration: TranscodeConfig

  transcoder: TranscodeFeature

  constructor(configuration: TranscodeConfig) {
    super()
    this.configuration = configuration

    this.transcoder = new TranscodeFeature(configuration)

    // Get Transcoder Properties
    const { parseConfiguration, display, ffmpegCommands } = this.transcoder

    const { extension, type } = parseConfiguration()

    this.updateDisplay(display, type)
    this.changeFileExtension(extension)

    this.setFFmpegCommands(ffmpegCommands)

    this.setFFmpegInputCommand()
  }

  setProgress = () => {
    this.progressBar = { name: 'Combining videos ....', color: 'deepskyblue' }
  }

  setFileConfig = () => {
    this.fileConfig = {
      primaryType: 'video',
      types: [{ name: 'video', number: { min: 1, max: -1 } }]
    }
  }

  /**
   * This Feature needs no special configuration
   */
  parseConfiguration = () => ({ noConfig: true })

  setFFmpegCommands = (transcodeCommand: string) => {
    const outputCommand = transcodeCommand || '-c:v libx264 out.mp4'

    this.ffmpegCommands = `${outputCommand}`
  }

  setFFmpegInputCommand = async () => {
    const { FileStore, textWriter } = this

    const { loadedFiles } = FileStore

    const videoFiles = loadedFiles.video as FileString[]

    const inputFileText = videoFiles.reduce(
      (acc, file) => `${acc}\nfile ${isElectron ? file.path : file.name}`,
      ''
    )
    const inputFileName = `concat-file-${Math.random()}.txt`

    await textWriter(inputFileName, inputFileText)
  }

  /***
   * Function which writes a text file to disk
   *
   * There are two cases here:
   * 1. Browser, writes file to wasm memory
   * 2. Electron, writes file to temp storage
   */
  textWriter = async (fileName: string, fileText: string) => {
    if (isElectron) {
      console.info('Writing file', fileName, fileText)
      const filePath = await electron.writeText(fileName, fileText)

      this.ffmpegInputPaths = []

      this.fileInputType('', filePath)

      this.ffmpegInputCommand = ' -f concat -safe 0'

      return filePath
    } else {
      await ffmpeg.writeText(fileName, fileText)
      this.ffmpegInputPaths = []

      this.fileInputType(fileName, '')

      this.ffmpegInputCommand = `-f concat -safe 0 ${this.ffmpegInputCommand}`

      return '' // Returning null path as path is not need in browser
    }
  }
}

export default ConcatFeature

const ConcatUi = () => <TranscodeUi parents={['TRANSCODE']} />

export { ConcatUi }
