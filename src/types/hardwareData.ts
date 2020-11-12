export type HardwareDataType = {
  uuid: string
  inputFileData: string
  encodeTime: number
  threads: number
  configuration: string
  browser: string
  os: string
  navigator: string
  tester?: string
}

export type FileDataType = {
  size: number
  ext: string
}

// export { HardwareDataType, FileDataType };
