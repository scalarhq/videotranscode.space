import React from 'react'
import ffmpeg from '../../ts/ffmpeg'
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
    const { FileStore, fileInputType } = this

    const { loadedFiles } = FileStore

    const videoFiles = loadedFiles.video as string[]

    const inputFileText = videoFiles.reduce(
      (acc, path) => `${acc}\nfile ${path}`,
      ''
    )
    const inputFileName = `concat-file-${Math.random()}.txt`
    console.info('File Input', videoFiles, inputFileText, inputFileName)

    fileInputType(inputFileName)
    this.ffmpegInputCommand = `-f concat -safe 0 ${this.ffmpegInputCommand}`
    await ffmpeg.writeText(inputFileName, inputFileText)
  }
}

export default ConcatFeature

const ConcatUi = () => <TranscodeUi parents={['TRANSCODE']} />

export { ConcatUi }
