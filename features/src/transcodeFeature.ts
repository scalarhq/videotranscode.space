/* eslint-disable prettier/prettier */
import FFmpegFeature from '../FFmpegFeature';
import { FormatType, CodecType } from '../../src/types/formats';

class TranscodeFeature extends FFmpegFeature {
  display: boolean;

  specialType = 'Transcode Function';

  constructor(chosenFormat: FormatType, chosenCodec: CodecType) {
    super();
    const { extension, display, defaultCodec } = chosenFormat;
    this.changeFileExtension(extension);
    this.updateDisplay(display);
    this.setFFmpegCommands(defaultCodec, chosenCodec);
  }

  /**
   * Changes the File Extension After this Feature is Executed
   *
   * **This Changes the format of video file, check formats folder to see supported formats**
   *
   * @param newExtension Expect a string of the format name **without the dot** Example mp4, avi
   */

  private changeFileExtension = (newExtension: string): void => {
    this.outputFileName = `${this.inputFileName}-output.${newExtension}`;
  };

  /**
   * Updates the video display parameter for a format, which determines if it is showed in the video player or not.
   * @param displayType Expect a boolean of if the video format can be shown in an HTML5 <video> tag
   */
  private updateDisplay = (displayType: boolean): void => {
    this.display = displayType;
    // Updates display value in the store
  };

  setFFmpegCommands(defaultCodec: CodecType, chosenCodec: CodecType) {
    let finalCodec = defaultCodec ? `-c:v ${defaultCodec.ffmpegLib}` : '';

    if (chosenCodec) {
      finalCodec = `-c:v ${chosenCodec.ffmpegLib}`;
    }
    this.ffmpegCommands = finalCodec;
  }
}
export default TranscodeFeature;
