import List from '@cluiComponents/List'
import Slider from '@cluiComponents/Slider'
import FFmpegFeature from '@features/FFmpegFeature'
import useExistingSettings from '@features/useExistingSettings'
import React from 'react'

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
  const customObject = {
    name: 'Custom',
    value: 0,
    child: {
      component: Slider,
      props: {
        parents,
        min: 0,
        max: 100,
        startValue: 0,
        title: 'Custom Level'
      },
      paddingTop: 3
    }
  }

  const ListElements = [
    { name: 'Low', value: 10 },
    { name: 'Medium', value: 30 },
    { name: 'High', value: 60 },
    customObject
  ]

  const presets = {
    main: {
      key: 'COMPRESSION',
      value: 10
    }
  }

  const defaults = useExistingSettings({
    main: parents,
    defaults: presets
  })

  const { main } = defaults

  const listObject = ListElements.find(({ value }) => value === main.value)

  const current = listObject || {
    ...customObject,
    child: {
      ...customObject.child,
      props: {
        ...customObject.child?.props,
        startValue: main.value
      }
    }
  }

  const props = {
    parents,
    title: 'Compression Settings',
    current,
    list: ListElements
  }

  return <List {...props} />
}

export { CompressionUi }
