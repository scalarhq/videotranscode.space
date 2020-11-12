import FFmpegFeature from '../FFmpegFeature'

class GreyScaleFeature extends FFmpegFeature {
  configuration = {}

  constructor(configuration = {}) {
    super()
    this.configuration = configuration

    this.setProgress()
    this.setFileConfig()
    this.setFFmpegCommands()
  }

  /**
   * This Feature needs no special configuration
   */
  parseConfiguration = () => ({ noConfig: true })

  setProgress = () => {
    this.progressBar = { name: 'Making GreyScale ...', color: 'black' }
  }

  setFileConfig = () => {
    this.fileConfig = {
      primaryType: 'video',
      types: [{ name: 'video', number: { min: 1, max: 1 } }]
    }
  }

  setFFmpegCommands = () => {
    this.ffmpegCommands = '-vf format=gray'
  }
}

export default GreyScaleFeature
