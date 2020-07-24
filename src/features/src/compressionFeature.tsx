import React from 'react';
import Slider from '../../clui-ui-components/Slider';

import FFmpegFeature from '../FFmpegFeature';

class CompressionFeature extends FFmpegFeature {
  constructor(compressionValue: number) {
    super();
    const command = this.compressCommand(compressionValue);
    this.setFFmpegCommands(command);
  }

  setFFmpegCommands(command: string) {
    this.ffmpegCommands = command;
  }

  /**
   * Sets the compression value in the FFmpeg command
   * @param compressionValue: The compression value chosen on the slider
   */

  private compressCommand = (compressionValue: number): string => {
    const finalCompressionValue = `-crf ${compressionValue}`;
    return finalCompressionValue;
  };
}
export default CompressionFeature;

const CompressionUi = ({ parents }: { parents: Array<string> }) => (<Slider parents={parents} min={0} max={100} title="Compression Level" />);

export { CompressionUi };
