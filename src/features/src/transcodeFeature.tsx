/* global JSX */
import React from 'react'

import Dropdown from '../../clui-ui-components/Dropdown'
import codecs from '../../dist/codecs'
import formats from '../../dist/formats'
import { CodecType } from '../../types/formats'
import FFmpegFeature from '../FFmpegFeature'
import GIFTranscode, { GIFConfiguration, GIFUi } from './gifTranscode'

export type TranscodeConfig = {
  TRANSCODE: {
    FORMAT: {
      CODEC: { value: string; [name: string]: any }
      value: string
      [name: string]: any
      CONFIG?: GIFConfiguration['TRANSCODE']['FORMAT']['CONFIG']
    }
  }
  [name: string]: any
}

class TranscodeFeature extends FFmpegFeature {
  // @ts-ignore Set in Constructor
  configuration: TranscodeConfig

  constructor(configuration: TranscodeConfig) {
    super()
    this.configuration = configuration
    if (configuration.TRANSCODE.FORMAT.value !== 'GIF') {
      const {
        extension,
        display,
        defaultCodec,
        chosenCodec,
        type
      } = this.parseConfiguration()
      this.changeFileExtension(extension)
      this.updateDisplay(display, type)
      this.setFFmpegCommands(defaultCodec, chosenCodec)
      this.setProgress()
      this.setFileConfig()
    } else {
      const gifTranscode = new GIFTranscode(configuration as GIFConfiguration)
      const { ffmpegCommands, outputFile, progressBar } = gifTranscode
      console.info('GIF TRANSCODE Command', ffmpegCommands)
      this.ffmpegCommands = ffmpegCommands
      this.outputFile = outputFile
      this.progressBar = progressBar
      this.updateDisplay(false, 'image/gif')
    }
  }

  setProgress = () => {
    this.progressBar.name = 'Converting ...'
    this.progressBar.color = '#0d6efd'
  }

  setFileConfig = () => {
    this.fileConfig = {
      types: [{ name: 'video', number: { min: 1, max: 1 } }],
      primaryType: 'video'
    }
  }

  parseConfiguration = () => {
    const { configuration } = this

    const { TRANSCODE } = configuration
    const { FORMAT } = TRANSCODE
    const currentFormat = formats[FORMAT.value]
    const { CODEC } = FORMAT
    const chosenCodec = codecs[CODEC.value as keyof typeof codecs]
    const { extension, defaultCodec, display, type } = currentFormat

    return {
      extension,
      defaultCodec,
      display,
      chosenCodec,
      type
    }
  }

  setFFmpegCommands(
    defaultCodec: CodecType | null | undefined,
    chosenCodec: CodecType
  ) {
    let finalCodec = defaultCodec ? `-c:v ${defaultCodec.ffmpegLib}` : ''

    if (chosenCodec) {
      finalCodec = `-c:v ${chosenCodec.ffmpegLib}`
    }
    this.ffmpegCommands = finalCodec
  }
}
export default TranscodeFeature

/**
 *  Helper Function for TranscodeUi, to create CODEC Key from their names,
 *  This function is needed as a result of how they are processed
 *  As CODEC name H.264 becomes H264, this function handles that
 *  **This function is not needed for every feature**
 * @param name Codec Name as a string
 */
const createCodecValue = (name: string) =>
  name.replace('-', '').replace('.', '').replace(' ', '_').toUpperCase()

type TranscodeFormatList = {
  name: string
  value: string
  child?: {
    component: (props: any) => JSX.Element
    props: { [name: string]: any }
  }
}

const TranscodeUi = ({ parents }: { parents: Array<string> }) => {
  const formatList = Object.keys(formats)

  const currentParents = [...parents, 'FORMAT']

  const list: Array<TranscodeFormatList> = formatList.map(formatKey => {
    const currentFormat = formats[formatKey]
    const childProps = {
      title: 'Choose Codec',
      parents: [...currentParents, 'CODEC'],
      current: currentFormat.defaultCodec
        ? {
            name: currentFormat.defaultCodec.name,
            value: createCodecValue(currentFormat.defaultCodec.name)
          }
        : {
            name: currentFormat.codecs[0].name,
            value: createCodecValue(currentFormat.codecs[0].name)
          },
      dropdown: currentFormat.codecs.map(codec => ({
        name: codec.name,
        value: createCodecValue(codec.name)
      }))
    }
    const child = { component: Dropdown, props: childProps }
    const returnObject = { name: formatKey, value: formatKey, child }
    return returnObject
  })

  list.push({
    name: 'GIF',
    value: 'GIF',
    child: {
      component: GIFUi,
      props: {
        parents: currentParents
      }
    }
  })

  const mp4Format = formats.MP4
  const mp4ChildProps = {
    title: 'Choose Codec',
    parents: [...currentParents, 'CODEC'],
    current: mp4Format.defaultCodec
      ? {
          name: mp4Format.defaultCodec.name,
          value: createCodecValue(mp4Format.defaultCodec.name)
        }
      : {
          name: mp4Format.codecs[0].name,
          value: createCodecValue(mp4Format.codecs[0].name)
        },
    dropdown: mp4Format.codecs.map(codec => ({
      name: codec.name,
      value: createCodecValue(codec.name)
    }))
  }

  const props = {
    title: 'Choose Format',
    parents: currentParents,
    current: {
      name: 'MP4',
      value: 'MP4',
      child: { component: Dropdown, props: mp4ChildProps }
    },
    dropdown: list
  }

  return <Dropdown {...props} />
}

export { TranscodeUi }
