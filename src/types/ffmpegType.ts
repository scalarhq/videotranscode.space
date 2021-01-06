import { FileTypes } from './fileTypes'

export type FFmpegDataType = {
  outputFile: { name: string; type: FileTypes }
  threads: number
  ffmpegCommands: string
}
