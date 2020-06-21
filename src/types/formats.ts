type codecType = {
  name: string;
  compressionRange: {
    min: number;
    max: number;
  };
  ffmpegLib: string;
};

type formatType = {
  name: string;
  type: string;
  extension: string;
  display: boolean;
  codec: codecType[];
  defaultCodec: codecType | null;
};

type configurationType = {
  format: formatType;
  codec: codecType;
};

type finalSettingsType = {
  format: string;
  codec: string;
};

export { codecType, formatType, configurationType, finalSettingsType };
