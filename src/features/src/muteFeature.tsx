import FFmpegFeature from '@features/FFmpegFeature'

class MuteFeature extends FFmpegFeature {
  configuration = {}

  constructor(configuration = {}) {
    super()
    this.configuration = configuration

    this.setProgress()
    this.setFileConfig()
    this.setFFmpegCommands()
  }

  parseConfiguration = () => ({ noConfig: true })

  setProgress = () => {
    this.progressBar = { name: 'Muting Video ...', color: 'black' }
  }

  setFileConfig = () => {
    this.fileConfig = {
      primaryType: 'video',
      types: [{ name: 'video', number: { min: 1, max: 1 } }]
    }
  }

  setFFmpegCommands = () => {
    this.ffmpegCommands = '-an'
  }
}

export default MuteFeature
