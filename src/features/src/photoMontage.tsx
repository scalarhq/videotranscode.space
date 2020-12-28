import React from 'react'

import List from '../../clui-ui-components/List'
import SingleInput from '../../clui-ui-components/Single-Input'
import FFmpegFeature from '../FFmpegFeature'
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
    console.info('Frame Rate', frameRate, typeof FRAMERATE.value)
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
  ListElements.push({
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
  })

  const current = {
    name: 'Film (24)',
    value: 24,
    child: {
      component: TranscodeUi,
      props: { parents: parents.concat('TRANSCODE') }
    }
  }

  const props = {
    parents: newParents,
    title: 'Choose Framerate',
    current,
    list: ListElements
  }

  return (
    <div className="flex flex-col">
      <p className="text-3xl font-bold">Photo Montage Settings</p>
      <List {...props} />
    </div>
  )
}

export { PhotoMontageUi }
