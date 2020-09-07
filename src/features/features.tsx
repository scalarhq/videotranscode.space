import React from 'react';

// Features
import TranscodeFeature, { TranscodeUi } from './src/transcodeFeature';
import CompressionFeature, { CompressionUi } from './src/compressionFeature';
import PhotoMontageFeature, { PhotoMontageUi } from './src/photoMontage';
import ConcatFeature, { ConcatUi } from './src/concatFeature';

import keys from './featureKeys.json';
import GreyScaleFeature from './src/greyScaleFeature';

export type Feature =
  typeof TranscodeFeature
  | typeof CompressionFeature
  | typeof PhotoMontageFeature
  | typeof ConcatFeature
  | typeof GreyScaleFeature;

export type FeatureElement = {
  name: string;
  description: string;
  feature: Feature;
  ui?: JSX.Element | string;
};

export type Features = {
  [name in keyof typeof keys]: FeatureElement
};

const FEATURES: Features = {
  TRANSCODE: {
    name: 'Convert',
    description: 'Choose which format to convert your video to',
    feature: TranscodeFeature,
    ui: <TranscodeUi parents={['TRANSCODE']} />,
  },
  COMPRESS: {
    name: 'Compress',
    description: 'Choose how much you want to compress your video',
    feature: CompressionFeature,
    ui: <CompressionUi parents={['COMPRESS']} />,
  },
  PhotoMontage: {
    name: 'Photo_Montages',
    description: 'Create a video montage from photos(you can add audio too!)',
    feature: PhotoMontageFeature,
    ui: <PhotoMontageUi parents={['PHOTO_MONTAGE']} />,
  },
  Concat: {
    name: 'Combine-Videos',
    description: 'Combine multiple videos',
    feature: ConcatFeature,
    ui: <ConcatUi />,
  },
  GreyScale: {
    name: 'Greyscale',
    description: 'Make Video black and white',
    feature: GreyScaleFeature,
  },
};

export default FEATURES;
