/* global JSX */
import React from 'react'

import FeatureDescription from './featureDescription'
import keys from './featureKeys.json'
import AspectRatioFeature, { AspectRatioUi } from './src/aspectRatioFeature'
import CombinedExecFeature from './src/combinedExecFeature'
import CompressionFeature, { CompressionUi } from './src/compressionFeature'
import ConcatFeature, { ConcatUi } from './src/concatFeature'
import GIFTranscode, { GIFUi } from './src/gifTranscode'
// UI LESS Features
import GreyScaleFeature from './src/greyScaleFeature'
import MuteFeature from './src/muteFeature'
import PhotoMontageFeature, { PhotoMontageUi } from './src/photoMontage'
// Custom Run Feature
import RunFeature, { RunUi } from './src/runFeature'
// Features
import TranscodeFeature, { TranscodeUi } from './src/transcodeFeature'
import TrimFeature, { TrimUi } from './src/trimFeature'
import VideoSpeedFeature, { VideoSpeedUI } from './src/videoSpeedFeature'

export type Feature =
  | typeof MuteFeature
  | typeof TranscodeFeature
  | typeof CompressionFeature
  | typeof PhotoMontageFeature
  | typeof ConcatFeature
  | typeof GreyScaleFeature
  | typeof AspectRatioFeature
  | typeof RunFeature
  | typeof TrimFeature
  | typeof CombinedExecFeature
  | typeof VideoSpeedFeature
  | typeof GIFTranscode

export type FeatureElement = {
  name: string
  description: string
  feature: Feature
  ui?: JSX.Element | string
  noDisplay?: boolean
  descriptionUI?: JSX.Element // This will show up as the description of the feature
  disableAdd?: boolean
}

export type Features = {
  [name in keyof typeof keys]: FeatureElement
}

const FEATURES: Features = {
  TRANSCODE: {
    name: 'Convert',
    description: 'Choose which format to convert your video to',
    feature: TranscodeFeature,
    ui: <TranscodeUi parents={['TRANSCODE']} />,
    descriptionUI: (
      <FeatureDescription
        name="Convert"
        description="Choose which format your video is converted to"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['video'],
          description: 'Same video in a different format'
        }}></FeatureDescription>
    )
  },
  COMPRESS: {
    name: 'Compress',
    description: 'Choose how much you want to compress your video',
    feature: CompressionFeature,
    ui: <CompressionUi parents={['COMPRESS']} />,
    descriptionUI: (
      <FeatureDescription
        name="Compress"
        description="Reduce the size of your video files!"
        extraDescription="The higher the setting the smaller the files"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['video'],
          description: 'Same video in a smaller size'
        }}></FeatureDescription>
    )
  },
  TRIM: {
    name: 'Trim',
    description: 'Trim or cut your video',
    feature: TrimFeature,
    ui: <TrimUi parents={['TRIM']} />,
    disableAdd: true
  },
  PHOTOMONTAGE: {
    name: 'Photo-Montages',
    description: 'Create a video montage from photos(you can add audio too!)',
    feature: PhotoMontageFeature,
    ui: <PhotoMontageUi parents={['PHOTO_MONTAGE']} />,
    descriptionUI: (
      <FeatureDescription
        name="Photo Montages"
        description="Combine your photos into a video"
        extraDescription="Music is also accepted. Ps: Framerate is the number of images per second"
        fileInput={{
          types: ['image', 'image', 'image', 'audio'],
          description: 'Your photos and/or music'
        }}
        fileOutput={{
          types: ['video'],
          description: 'One merged video'
        }}></FeatureDescription>
    )
  },

  CONCAT: {
    name: 'Combine-Videos',
    description: 'Combine multiple videos',
    feature: ConcatFeature,
    ui: <ConcatUi />,
    descriptionUI: (
      <FeatureDescription
        name="Combine Videos"
        description="Combine multiple videos into one video"
        fileInput={{
          types: ['video', 'video'],
          description: 'Your videos'
        }}
        fileOutput={{
          types: ['video'],
          description: 'One big video'
        }}></FeatureDescription>
    )
  },

  GIF: {
    name: 'GIF',
    description: 'Convert videos to GIFs',
    feature: GIFTranscode,
    ui: <GIFUi parents={['TRANSCODE', 'FORMAT']} />,
    descriptionUI: (
      <FeatureDescription
        name="GIF"
        description="Convert videos to GIFs"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['image'],
          description: 'Your video as a GIF'
        }}></FeatureDescription>
    )
  },

  ASPECT_RATIO: {
    name: 'Aspect-Ratio',
    description: 'Change the aspect ratio for the video',
    feature: AspectRatioFeature,
    ui: <AspectRatioUi parents={['ASPECT_RATIO']} />,
    descriptionUI: (
      <FeatureDescription
        name="Aspect Ratio"
        description="Change the aspect ratio of your video"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['video'],
          description: 'The same video in a different aspect ratio'
        }}></FeatureDescription>
    )
  },

  VIDEO_SPEED: {
    name: 'Video Speed',
    description: 'Speed up or slow down your video',
    feature: VideoSpeedFeature,
    ui: <VideoSpeedUI parents={['VIDEO_SPEED']} />,
    descriptionUI: (
      <FeatureDescription
        name="Video Speed"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['video'],
          description: 'The same video sped up or slowed down'
        }}
        description="Speed up or slow down your video"></FeatureDescription>
    )
  },

  // UI LESS FEATURES

  GREYSCALE: {
    name: 'Greyscale',
    description: 'Make Video black and white',
    feature: GreyScaleFeature,
    descriptionUI: (
      <FeatureDescription
        name="Greyscale"
        description="Make your video black and white"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['video'],
          description: 'The same video but black and white'
        }}></FeatureDescription>
    )
  },

  COMBINED_EXEC_FEATURE: {
    name: 'Combined-Execution',
    description: 'Running multiple commands together',
    feature: CombinedExecFeature,
    noDisplay: true
  },
  MUTE: {
    name: 'Mute',
    description: 'Mute the audio from videos',
    feature: MuteFeature,
    descriptionUI: (
      <FeatureDescription
        name="Mute"
        description="Mute your videos"
        fileInput={{
          types: ['video'],
          description: 'Your video'
        }}
        fileOutput={{
          types: ['video'],
          description: 'The same video but with no audio'
        }}></FeatureDescription>
    )
  },

  // No Display Features

  CUSTOM_RUN: {
    name: 'Custom-Run(Experimental)',
    description: 'Run your own ffmpeg command',
    feature: RunFeature,
    ui: <RunUi parents={['RUN']} />,
    noDisplay: true
  }
}

export default FEATURES
