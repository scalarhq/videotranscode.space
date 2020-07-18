/* eslint-disable prettier/prettier */
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
