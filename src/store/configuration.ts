import { CodecType, FormatType } from '../types/formats';

import codecs from '../dist/codecs';
import formats from '../dist/formats';

export const CODEC_TYPES: { [name: string]: CodecType } = codecs;

export const FORMAT_TYPES: { [name: string]: FormatType } = formats;

export enum ConfigOptions {
  Format,
  Codec,
  Compression,
}

type ChosenConfig = {
  [name: string]: CodecType | FormatType;
};

const returnName = (config: ChosenConfig, name: string) => {
  return Object.values(config).find((e: CodecType | FormatType) => e.name === name);
};

/**
 * Find a CODEC_TYPE or FORMAT_TYPE by its name
 *
 */
export const find = (type: ConfigOptions, name: string) => {
  // console.info("From find", type, type === ConfigOptions.Format);
  if (type === ConfigOptions.Codec) return returnName(CODEC_TYPES, name);
  if (type === ConfigOptions.Format) return returnName(FORMAT_TYPES, name);
  return null;
};
