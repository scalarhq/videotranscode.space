import React from 'react';

import TranscodeFeature, { TranscodeConfig, TranscodeUi } from './transcodeFeature';

import FFmpegFeature from '../FFmpegFeature';

import SingleInput from '../../clui-ui-components/Single-Input';

import List from '../../clui-ui-components/List';

type PhotoMontageConfig = {
  'PHOTO_MONTAGE': TranscodeConfig & { 'FRAMERATE': { value: number;[name: string]: any } },
  [name: string]: any
}

class PhotoMontageFeature extends FFmpegFeature {
  configuration: PhotoMontageConfig

  transcoder: TranscodeFeature

  constructor(config: PhotoMontageConfig) {
    super();

    this.configuration = config;

    this.transcoder = new TranscodeFeature(config.PHOTO_MONTAGE);

    const { frameRate } = this.parseConfiguration();

    // Get Transcoder Properties
    const {
      parseConfiguration, display, ffmpegCommands,
    } = this.transcoder;

    const { extension, type } = parseConfiguration();

    console.info('Change File Extension', extension);

    // Call Transcoder Functions
    this.updateDisplay(display, type);
    this.changeFileExtension(extension);

    this.setFFmpegCommands(ffmpegCommands, frameRate);
    this.setProgress();
    this.setFileConfig();
    this.setFFmpegInputCommand();

    console.info('Check Settings', this.outputFile, this.ffmpegInputCommand);
  }

  setFFmpegCommands = (transcodeCommand: string, frameRate: number) => {
    const outputCommand = transcodeCommand || '-c:v libx264 out.mp4';

    this.ffmpegCommands = `-framerate ${frameRate}  -shortest -pix_fmt yuv420p ${outputCommand}`;
  }

  setFFmpegInputCommand = () => {
    // Set Default Image Input Command
    this.ffmpegInputCommand = this.imageInputType(this.FileStore.currentFileExtension);
    const audioFiles = this.FileStore.files.audio;
    if (audioFiles) {
      // Append Image Input Command with Audio Input
      this.ffmpegInputCommand = `${this.ffmpegInputCommand} -i ${audioFiles[0].name}`;
    }
  }

  parseConfiguration = () => {
    const { configuration } = this;
    const { PHOTO_MONTAGE } = configuration;
    const { FRAMERATE } = PHOTO_MONTAGE;
    return { frameRate: FRAMERATE.value };
  }

  setFileConfig = () => {
    this.fileConfig = { primaryType: 'image', types: [{ name: 'image', number: { min: 1, max: -1 } }, { name: 'audio', number: { min: 1, max: 1 } }] };
  }

  setProgress = () => {
    this.progressBar = { name: 'Creating Photo Montage ...', color: 'hotpink' };
  }
}

export default PhotoMontageFeature;

const PhotoMontageUi = ({ parents }: { parents: Array<string> }) => {
  const newParents = [...parents, 'FRAMERATE'];

  const ListElements: Array<{ name: string, value: number, child?: { component: any, props: any, [name: string]: any }, }> = [{ name: '15', value: 15 }, { name: 'Film (24)', value: 24 }, { name: '30', value: 30 }];

  for (const element of ListElements) {
    Object.assign(element, {
      child: {
        component: TranscodeUi,
        props: { parents: parents.concat('TRANSCODE') },
      },
    });
  }
  ListElements.push({
    name: 'Custom',
    value: 0,
    child: {
      component: SingleInput,
      props: {
        parents: newParents,
        type: 'number',
        child: {
          component: TranscodeUi,
          props: { parents: parents.concat('TRANSCODE') },
        },
      },
      paddingTop: 3,
    },
  });

  const current = {
    name: 'Film (24)',
    value: 24,
    child: {
      component: TranscodeUi,
      props: { parents: parents.concat('TRANSCODE') },
    },
  };

  const props = {
    parents: newParents,
    title: 'Photo Montage Settings',
    current,
    list: ListElements,
  };

  return (
    <List {...props} />
  );
};

export { PhotoMontageUi };
