import React from 'react';
import Slider from '../../clui-ui-components/Slider';

import FFmpegFeature from '../FFmpegFeature';

type CompressionConfig = {
  'COMPRESS': { value: number, [name: string]: any },
  [name: string]: any
}

class CompressionFeature extends FFmpegFeature {
  configuration: CompressionConfig

  constructor(configuration: CompressionConfig) {
    super();
    this.configuration = configuration;
    const { compressionValue } = this.parseConfiguration();
    const command = this.compressCommand(compressionValue);
    this.setFFmpegCommands(command);
    this.setProgress();
  }

  setFFmpegCommands(command: string) {
    this.ffmpegCommands = command;
  }

  setProgress = () => {
    this.progressBar.name = 'Compressing ...';
    this.progressBar.color = '#3FBD71';
  }

  /**
   * Sets the compression value in the FFmpeg command
   * @param compressionValue: The compression value chosen on the slider
   */

  private compressCommand = (compressionValue: number): string => {
    const finalCompressionValue = `-crf ${compressionValue}`;
    return finalCompressionValue;
  };

  parseConfiguration = () => {
    const { COMPRESS } = this.configuration;
    const { value } = COMPRESS;
    return { compressionValue: value };
  }
}

export default CompressionFeature;

const CompressionUi = ({ parents }: { parents: Array<string> }) => (<Slider parents={parents} min={0} max={100} title="Compression Level" />);

export { CompressionUi };
