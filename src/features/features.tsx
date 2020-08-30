import React from 'react';

// Features
import TranscodeFeature, { TranscodeUi } from './src/transcodeFeature';
import CompressionFeature, { CompressionUi } from './src/compressionFeature';
import PhotoMontageFeature, { PhotoMontageUi } from './src/photoMontage';

import keys from './featureKeys.json';

export type Feature = typeof TranscodeFeature |
  typeof CompressionFeature | typeof PhotoMontageFeature;

export type FeatureElement = {
  feature: Feature;
  description: string;
  ui: JSX.Element | string;
};

export type Features = {
  [name in keyof typeof keys]: FeatureElement
};

const FEATURES: Features = {
  TRANSCODE: {
    feature: TranscodeFeature,
    description: 'Choose which format to convert your video to',
    ui: <TranscodeUi parents={['TRANSCODE']} />,
  },
  COMPRESS: {
    feature: CompressionFeature,
    description: 'Choose how much you want to compress your video',
    ui: <CompressionUi parents={['COMPRESS']} />,
  },
  PhotoMontage: {
    feature: PhotoMontageFeature,
    description: 'Create a video montage from photos(you can add audio too!)',
    ui: <PhotoMontageUi parents={['PHOTO_MONTAGE']} />,
  },
};

export default FEATURES;
