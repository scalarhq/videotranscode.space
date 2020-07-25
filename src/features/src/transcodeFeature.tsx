import React from 'react';
import formats from '../../dist/formats';
import List from '../../clui-ui-components/List';

import FFmpegFeature from '../FFmpegFeature';
import { FormatType, CodecType } from '../../types/formats';

class TranscodeFeature extends FFmpegFeature {
  // @ts-ignore Set in Constructor
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
   * Updates the video display parameter for a format, which determines
   * if it is showed in the video player or not.
   * @param displayType Expect a boolean of if the video format can be shown in an HTML5 <video> tag
   */
  private updateDisplay = (displayType: boolean): void => {
    this.display = displayType;
    // Updates display value in the store
  };

  setFFmpegCommands(defaultCodec: CodecType | null | undefined, chosenCodec: CodecType) {
    let finalCodec = defaultCodec ? `-c:v ${defaultCodec.ffmpegLib}` : '';

    if (chosenCodec) {
      finalCodec = `-c:v ${chosenCodec.ffmpegLib}`;
    }
    this.ffmpegCommands = finalCodec;
  }
}
export default TranscodeFeature;

const TranscodeUi = ({ parents }: { parents: Array<string> }) => {
  const formatList = Object.keys(formats);

  const currentParents = [...parents, 'FORMAT'];

  const list = formatList.map((formatKey) => {
    const currentFormat = formats[formatKey];
    const childProps = {
      title: 'Choose Codec',
      parents: [...currentParents, 'CODEC'],
      current: currentFormat.defaultCodec
        ? { name: currentFormat.defaultCodec.name, value: currentFormat.defaultCodec.name }
        : { name: currentFormat.codecs[0].name, value: currentFormat.codecs[0].name },
      list: currentFormat.codecs.map((codec) => ({ name: codec.name, value: codec.name })),
    };
    const returnObject = { name: formatKey, value: formatKey, child: { component: List, props: childProps } };
    return returnObject;
  });

  const mp4Format = formats.MP4;
  const mp4ChildProps = {
    title: 'Choose Codec',
    parents: [...currentParents, 'CODEC'],
    current: mp4Format.defaultCodec
      ? { name: mp4Format.defaultCodec.name, value: mp4Format.defaultCodec.name }
      : { name: mp4Format.codecs[0].name, value: mp4Format.codecs[0].name },
    list: mp4Format.codecs.map((codec) => ({ name: codec.name, value: codec.name })),
  };

  const props = {
    title: 'Choose Format',
    parents: currentParents,
    current: { name: 'MP4', value: 'MP4', child: { component: List, props: mp4ChildProps } },
    list,
  };

  return (
    <List {...props} />
  );
};

export { TranscodeUi };
