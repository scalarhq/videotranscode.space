export type CodecType = {
  name: string;
  compressionRange: CodecCompressionRange;
  ffmpegLib: string;
  notSupported?: boolean;
};

export type CodecCompressionRange = {
  min: number;
  max: number;
};

export type FormatType = {
  name: string;
  type: string;
  extension: string;
  display: boolean;
  codecs: CodecType[];
  defaultCodec?: CodecType | null;
};

export type ConfigurationType = {
  format: FormatType;
  codec: CodecType;
};

export type FinalSettingsType = {
  format: string;
  codec: string;
};

// export { CodecType, FormatType, ConfigurationType, FinalSettingsType };
