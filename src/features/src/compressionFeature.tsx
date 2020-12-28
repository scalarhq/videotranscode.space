import React from 'react'

import List from '../../clui-ui-components/List'
import Slider from '../../clui-ui-components/Slider'
import FFmpegFeature from '../FFmpegFeature'

type CompressionConfig = {
  COMPRESS: { value: number; [name: string]: any }
  [name: string]: any
}

class CompressionFeature extends FFmpegFeature {
  configuration: CompressionConfig

  constructor(configuration: CompressionConfig) {
    super()
    this.configuration = configuration
    const { compressionValue } = this.parseConfiguration()
    const command = this.compressCommand(compressionValue)
    this.setFFmpegCommands(command)
    this.setProgress()
    this.setFileConfig()
  }

  setFFmpegCommands(command: string) {
    this.ffmpegCommands = command
  }

  setProgress = () => {
    this.progressBar.name = 'Compressing ...'
    this.progressBar.color = '#3FBD71'
  }

  setFileConfig = () => {
    this.fileConfig = {
      types: [{ name: 'video', number: { min: 1, max: 1 } }],
      primaryType: 'video'
    }
  }

  /**
   * Sets the compression value in the FFmpeg command
   * @param compressionValue: The compression value chosen on the slider
   */
  private compressCommand = (compressionValue: number): string => {
    const finalCompressionValue = `-crf ${compressionValue}`
    return finalCompressionValue
  }

  parseConfiguration = () => {
    const { COMPRESS } = this.configuration
    const { value } = COMPRESS
    return { compressionValue: value }
  }
}

export default CompressionFeature

const CompressionUi = ({ parents }: { parents: Array<string> }) => {
  const ListElements = [
    { name: 'Low', value: 10 },
    { name: 'Medium', value: 30 },
    { name: 'High', value: 60 },
    {
      name: 'Custom',
      value: 0,
      child: {
        component: Slider,
        props: {
          parents,
          min: 0,
          max: 100,
          title: 'Custom Level'
        },
        paddingTop: 3
      }
    }
  ]

  const current = { name: 'Low', value: 10 }

  const props = {
    parents,
    title: 'Compression Settings',
    current,
    list: ListElements
  }

  return <List {...props} />
}

export { CompressionUi }
