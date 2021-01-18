import { FFmpegDataType } from './ffmpegType'

export type ElectronFFmpeg = {
  run: (
    inputFilePaths: Array<string>,
    ffmpegData: {
      outputFile: FFmpegDataType['outputFile']
      threads: FFmpegDataType['threads']
      ffmpegCommands: string
    },
    updateProgress: (percent: number) => void,
    inputOptions?: string
  ) => Promise<string>
}

export type TransitImage = {
  name: string
  arrayBuffer: ArrayBuffer
}

export type ReturnedImage = {
  name: string
  path: string
}

export type ElectronFileApi = {
  tempDir: string
  saveFile: (oldPath: string, ext: string) => void
  writeText: (fileName: string, fileContent: string) => Promise<string>
  readOutputFile: (fileName: string) => Buffer
  saveImages: (images: Array<TransitImage>) => Promise<ReturnedImage[]>
}

export type ElectronApi =
  | {
      ffmpeg: ElectronFFmpeg
      fileApi: ElectronFileApi
    }
  | undefined
