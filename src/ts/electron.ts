/* eslint-disable @typescript-eslint/ban-types */
import ComponentStore from '../store/componentStore'
import {
  ElectronApi,
  ElectronFFmpeg,
  ElectronFileApi,
  TransitImage
} from '../types/electronApi'
import { FFmpegDataType } from '../types/ffmpegType'

const { ProgressStore } = ComponentStore

const { updateProgress } = ProgressStore

class Electron {
  _isElectron = false
  _electronApi: ElectronApi

  _ffmpegApi: ElectronFFmpeg | undefined

  _fileApi: ElectronFileApi | undefined

  constructor() {
    if (typeof window !== 'undefined') {
      // @ts-ignore Should be defined in window for electron all
      this._isElectron = window.isElectron || false
      // @ts-ignore Should be defined in window if electron app
      this._electronApi = window.electronApi || undefined
    }

    if (this.isElectron && this._electronApi) {
      const { ffmpeg, fileApi } = this._electronApi
      this._ffmpegApi = ffmpeg
      this._fileApi = fileApi
    }
  }

  get isElectron(): boolean {
    return this._isElectron
  }

  get tempDir(): string | undefined {
    if (this.isElectron) {
      return this._fileApi?.tempDir
    }
    return undefined
  }

  /**
   * Run FFmpeg within node
   * @param inputFilePaths Array of strings representing input file paths
   * @param ffmpegData Object of type {@link FFmpegDataType}
   * @param inputOptions Any input options as a string
   */
  runFFmpeg = (
    inputFilePaths: string[],
    ffmpegData: FFmpegDataType,
    inputOptions?: string
  ) => {
    if (this.isElectron && this._ffmpegApi) {
      const { run } = this._ffmpegApi

      console.info('Within Electron Bridge Running FFmpeg')

      return run(
        inputFilePaths,
        {
          ...ffmpegData,
          ffmpegCommands: ffmpegData.ffmpegCommands
        },
        updateProgress,
        inputOptions
      )
    }
  }

  /**
   *  Reads a file from disk inside tmp folder
   * @param fileName name of file to be read
   */
  readFile = (fileName: string) => {
    if (this._fileApi) {
      return this._fileApi.readOutputFile(fileName)
    }
  }

  /**
   *  Writes text to disk inside tmp folder, can write any string to disk
   * @param fileName Name of file being written
   * @param fileText Contents of file
   */
  writeText = (fileName: string, fileText: string) => {
    if (this._fileApi) {
      return this._fileApi.writeText(fileName, fileText)
    }
    return new Promise<string>(resolve => resolve('Undefined file api'))
  }

  /**
   * Function saves image objects into fs in the tmp folder, under another montage specific subfolder
   * @param images Array of type {@link TransitImage}
   */
  saveImages = (images: TransitImage[]) => {
    if (this._fileApi) {
      return this._fileApi.saveImages(images)
    }
    throw new Error('Using electron api without electron')
  }

  /**
   * Saves the final processed file to the desired location on file system.
   *  **Not a general save file function**
   * @param oldPath Old path of the file stored in tmp directory
   * @param ext Extention of the file
   */
  saveFile = (oldPath: string, ext: string) => {
    if (this.isElectron && this._fileApi) {
      const { saveFile } = this._fileApi
      // TODO Use this for saving files
      saveFile(oldPath, ext)
    }
  }
}

const electron = new Electron()

export default electron

export const isElectron = electron.isElectron

export const tempDir = electron.tempDir

/**
 * Hook that wraps functions to use electron or web versions
 */
export const electronWrapper = (
  func: Function,
  electronFunc?: Function,
  ...args: unknown[]
) => {
  if (isElectron) {
    if (electronFunc) return electronFunc(...args)
  } else {
    return func(...args)
  }
}
