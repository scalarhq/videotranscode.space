type CodecType = {
  name: string;
  compressionRange: CodecCompressionRange;
  ffmpegLib: string;
  notSupported?: boolean;
};

type CodecCompressionRange = {
  min: number;
  max: number;
};

type FormatType = {
  name: string;
  type: string;
  extension: string;
  display: boolean;
  codec: CodecType[];
  defaultCodec: CodecType | null;
};

type ConfigurationType = {
  format: FormatType;
  codec: CodecType;
};

type FinalSettingsType = {
  format: string;
  codec: string;
};

export { CodecType, FormatType, ConfigurationType, FinalSettingsType };
