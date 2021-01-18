import List from '@cluiComponents/List'
import SingleInput from '@cluiComponents/Single-Input'
import FFmpegFeature from '@features/FFmpegFeature'
import useExistingSettings from '@features/useExistingSettings'
import React from 'react'

import TranscodeFeature, {
  TranscodeConfig,
  TranscodeUi
} from './transcodeFeature'

type PhotoMontageConfig = {
  PHOTO_MONTAGE: TranscodeConfig & {
    FRAMERATE: { value: number; [name: string]: any }
  }
  [name: string]: any
}

class PhotoMontageFeature extends FFmpegFeature {
  configuration: PhotoMontageConfig

  transcoder: TranscodeFeature

  frameRate: number

  constructor(config: PhotoMontageConfig) {
    super()

    this.configuration = config

    this.transcoder = new TranscodeFeature(config.PHOTO_MONTAGE)

    const { frameRate } = this.parseConfiguration()

    this.frameRate = frameRate

    // Get Transcoder Properties
    const { parseConfiguration, display, ffmpegCommands } = this.transcoder

    const { extension, type } = parseConfiguration()

    // Call Transcoder Functions
    this.updateDisplay(display, type)
    this.changeFileExtension(extension)

    this.setFFmpegCommands(ffmpegCommands)
    this.setProgress()
    this.setFileConfig()
    this.setFFmpegInputCommand()

    console.info('Check Settings', this.outputFile, this.ffmpegInputCommand)
  }

  setFFmpegCommands = (transcodeCommand: string) => {
    const outputCommand = transcodeCommand || '-c:v libx264 out.mp4'

    this.ffmpegCommands = `-r 30  -shortest -pix_fmt yuv420p ${outputCommand}`
  }

  setFFmpegInputCommand = () => {
    // Set Default Image Input Command
    this.imageInputType(this.frameRate, this.FileStore.currentFileExtension)
    const audioFiles = this.FileStore.files.audio
    if (audioFiles) {
      // Append Image Input Command with Audio Input
      this.ffmpegInputCommand = `${this.ffmpegInputCommand} -i ${audioFiles[0].file.name}`
    }
  }

  parseConfiguration = () => {
    const { configuration } = this
    const { PHOTO_MONTAGE } = configuration
    const { FRAMERATE } = PHOTO_MONTAGE

    const frameRate =
      typeof FRAMERATE.value === 'string'
        ? parseInt(FRAMERATE.value, 10)
        : FRAMERATE.value
    return { frameRate }
  }

  setFileConfig = () => {
    this.fileConfig = {
      primaryType: 'image',
      types: [
        { name: 'image', number: { min: 1, max: -1 } },
        { name: 'audio', number: { min: 1, max: 1 } }
      ]
    }
  }

  setProgress = () => {
    this.progressBar = { name: 'Creating Photo Montage ...', color: 'hotpink' }
  }
}

export default PhotoMontageFeature

const PhotoMontageUi = ({ parents }: { parents: Array<string> }) => {
  const newParents = [...parents, 'FRAMERATE']

  const customObject = {
    name: 'Custom',
    value: 0,
    child: {
      component: SingleInput,
      props: {
        parents: newParents,
        type: 'number',
        defaultValue: 1,
        otherProps: { min: 1 },
        child: {
          component: TranscodeUi,
          props: { parents: parents.concat('TRANSCODE') }
        }
      },
      paddingTop: 3
    }
  }

  const ListElements: Array<{
    name: string
    value: number
    child?: { component: any; props: any; [name: string]: any }
  }> = [
    { name: '15', value: 15 },
    { name: 'Film (24)', value: 24 },
    { name: '30', value: 30 }
  ]

  for (const element of ListElements) {
    Object.assign(element, {
      child: {
        component: TranscodeUi,
        props: { parents: parents.concat('TRANSCODE') }
      }
    })
  }
  ListElements.push(customObject)

  const presets = {
    main: { key: 'FRAMERATE', value: 24 }
  }

  const defaults = useExistingSettings({
    main: newParents,
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
        defaultValue: main.value
      }
    }
  }

  const props = {
    parents: newParents,
    title: 'Choose Framerate',
    current,
    list: ListElements
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <List {...props} />
      </div>
    </div>
  )
}

export { PhotoMontageUi }
