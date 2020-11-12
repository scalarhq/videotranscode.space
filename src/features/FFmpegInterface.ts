import { FileConfigType, FileTypes, CustomFileType } from '../types/fileTypes'

import ComponentStore from '../store/componentStore'

const { FileStore, VideoStore } = ComponentStore

export default interface FFmpegInterface {
  // Stores

  /**
   * Reference to the FileStore {@link FileStore}
   */
  FileStore: typeof FileStore

  /**
   *  Reference to the VideoStore {@link VideoStore}
   */
  VideoStore: typeof VideoStore

  /**
   * Reference to entire component store, which is the store that contains all stores
   * {@link ComponentStore}
   */
  ComponentStore: typeof ComponentStore

  // Values

  /** String Representing the ffmpeg command executed */
  ffmpegCommands: string

  /** Number of threads in a user's computer */
  threads: number

  inputFile: CustomFileType

  outputFile: CustomFileType

  /** Object determining the text and color of the progress bar */
  progressBar: { name: string; color: string }

  /** String representing the how files are inputted to FFmpeg */
  ffmpegInputCommand: string

  /** Boolean indicating if a video file can be displayed in the browser or not */
  display: boolean

  /**
   * Determines the configuration of how you plan to use files in your feature
   *
   * Default Settings
   *
   * number : {min : 1, max : -1}, this means the function will use at minimum
   * 1 file and use all the files the user uploads
   *
   * types : ['video'], this means the function will only use video files and
   * nothing else will be given to it.
   *
   * Accepted Types
   *  'video', 'image', 'audio', 'other'(represents any other file, eg text files)
   *
   */
  fileConfig: FileConfigType

  /**
   * If a function needs a specific type of input command, other than default
   * then this object as a few common inputs that can be used
   */
  commonInputTypes: {
    default: () => void
    images: (frameRate: number, ext: string) => void
    fileRead: (filename: string) => void
  }

  // Abstract Values

  /**
   * Every Feature is expected to set its own configuration properties,
   *
   * these properties will be in an Object {key: {}}
   *
   * where the keys are the names of the parents you set in your UI component
   *
   * Each key will have an object of type {value : any, [name:string]: any}
   *
   * This object is expected to be used in setting the configurations of the Feature.
   *
   * @param configuration Reference to  {@link CluiStore.configuration}
   */
  configuration: {
    [name: string]: { value: any; [name: string]: any }
  }

  // Methods

  /**
   * Retrieves the current file of the last modified file from the store
   */
  getCurrentFile: () => { name: string; type: FileTypes }

  /**
   * Sets the FFmpeg Input Command, this function can and
   *
   * should be overwritten when special input cases are needed
   *
   * By default, this function will set the current file as single file input
   *
   * Check {@link commonInputTypes} to see already implemented functions for you
   */
  setFFmpegInputCommand: () => void

  /**
   Calls FFmpeg with the given ffmpegCommands and appropriate inputFileName
  * @returns The file name of the processed file
  */
  runFFmpeg: () => Promise<CustomFileType>

  /**
   * Changes the File Extension After this Feature is Executed
   *
   * **This Changes the format of video file, check formats folder to see supported formats**
   *
   * @param newExtension Expect a string of the format name **with the dot** Example .mp4, .avi
   */
  changeFileExtension: (newExtension: string) => void

  /**
   * Updates the video display parameter for a format, which determines
   * if it is showed in the video player or not.
   * @param displayType Expect a boolean of if the video format can be shown in an HTML5 <video> tag
   */
  updateDisplay: (displayType: boolean, type: string) => void

  /**
   * Function sets the chosen progressBar values to the store
   */
  updateProgress: () => void

  /**
   * Sets FFmpeg Input Command for reading images for any function
   *
   * **You will have to do further changes to the FFmpeg Command to use Images**
   *
   * This command just loads the images
   */
  imageInputType: (frameRate: number, ext: string) => void

  /**
   * Sets FFmpeg Input Command for reading from input file
   *
   * **Please make sure this works in FFmpeg first**
   *
   * **Further text file expectation,**
   *
   * A) Follow FFmpeg File Name Rules
   *
   * B) Use FFmpeg WriteTxt to write the file to memory
   *
   * Eg https://github.com/Etwas-Builders/ffmpeg.wasm/blob/ebdc295b4ab7e6412b4cdcbd31b9ceae0b9ad364/src/createFFmpeg.js#L114
   *
   *  @param fileName A string that is the name of the text file
   */
  fileInputType: (fileName: string) => void

  // Abstract Methods

  /**
   * Expect Child Class to define this function to set ffmpegCommands property
   *
   * This method can take N number of arguments of any type
   */
  setFFmpegCommands: (...args: any[]) => void

  /**
   * Function Expected to parse the required values from
   * this.configuration and return to constructor
   *
   */
  parseConfiguration: () => { [name: string]: any }

  /**
   * Function is Expected to set the name and color of the progress bar for this feature
   *
   * this.progressBar : { name: string; color: string}
   *
   * This function is expected to be called in constructor
   */
  setProgress: () => void
  /**
   * Function is Expected to the configuration of files for this feature
   *
   * this.fileConfig :
   *
   * {primaryType : string, types : [{name : string,number : {min : number, max : number}]}}
   */
  setFileConfig: () => void
}
