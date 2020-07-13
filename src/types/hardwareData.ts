type HardwareDataType = {
  inputFileSize: string;
  encodeTime: number;
  threads: number;
  inputFileFormat: string;
  outputFileFormat: string;
  outputFileCodec: string;
  browser: string;
  os: string;
  navigator: string;
  [name: string]: string;
};

type FileDataType = {
  size: number;
  ext: string;
};

export { HardwareDataType, FileDataType };
