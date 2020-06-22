type hardwareDataType = {
  inputFileSize: string;
  encodeTime: number;
  threads: number;
  inputFileFormat: string;
  outputFileFormat: string;
  outputFileCodec: string;
  browser: string;
  os: string;
  navigator: string;
};

type fileDataType = {
  size: number;
  ext: string;
};

export { hardwareDataType, fileDataType };
