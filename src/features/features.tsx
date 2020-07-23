import React from 'react';
import TranscodeFeature, { TranscodeUi } from './src/transcodeFeature';
import CompressionFeature from './src/compressionFeature';

export type Feature = typeof TranscodeFeature | typeof CompressionFeature;

export type Features = {
  [name: string]: {
    feature: Feature;
    description: string;
    ui: JSX.Element | string;
  };
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
    ui: 'Compress UI Component',
  },
};

export default FEATURES;
