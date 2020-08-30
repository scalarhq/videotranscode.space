import { ffmpegRunner } from '../ts/ffmpeg';

import ComponentStore from '../store/componentStore';

import { getThreads } from '../ts/hardware';

import { FileConfigType, FileTypes, CustomFileType } from '../types/fileTypes';

const { FileStore, ProgressStore, VideoStore } = ComponentStore;

const { updateStatic } = ProgressStore;

const { updateCurrentFile } = FileStore;

interface FFmpegInterface {
  configuration: {
    [name: string]: { value: any; [name: string]: any };
  };
  ffmpegCommands: string;
  threads: number;
  inputFile: CustomFileType;
  outputFile: CustomFileType;
  progressBar: { name: string; color: string };
  fileConfig: FileConfigType;
  ffmpegInputCommand: string;
  runFFmpeg: () => Promise<CustomFileType>;
  getCurrentFile: () => { name: string; type: FileTypes };
  setFFmpegCommands: (...args: any[]) => void;
  parseConfiguration: () => { [name: string]: any };
  setProgress: () => void;
  updateProgress: () => void;
  setFileConfig: () => void;
  setFFmpegInputCommand: () => void;
}

abstract class FFmpegFeature implements FFmpegInterface {
  public ffmpegCommands: string;

  public threads: number;

  public inputFile: { name: string; type: FileTypes } = { name: '', type: 'video' };

  public outputFile: { name: string; type: FileTypes } = { name: '', type: 'video' };

  public progressBar = { name: 'Processing....', color: '#0d6efd' };

  public ffmpegInputCommand = '';

  public display: boolean = false;

  public FileStore = FileStore;

  public VideoStore = VideoStore;

  /**
   * Determines the configuration of how you plan to use files in your feature
   * Default Settings
   * number : {min : 1, max : -1}, this means the function will use at minimum
   * 1 file and use all the files the user uploads
   * types : ['video'], this means the function will only use video files and
   * nothing else will be given to it.
   *
   * Accepted Types
   *  'video', 'image', 'audio', 'other'(represents any other file, eg text files)
   *
   */
  public fileConfig = {
    primaryType: 'video',
    types: [{ name: 'video', number: { min: 1, max: -1 } }],
  };

  /**
   * Every Feature is expected to set its own configuration properties,
   * these properties will be in an Object {key: {}}
   * where the keys are the names of the parents you set in your UI component
   * Each key will have an object of type {value : any, [name:string]: any}
   * This object is expected to be used in setting the configurations of the Feature.
   *
   * @param configuration {@link CluiStore}
   */
  public abstract configuration: {
    [name: string]: { value: any; [name: string]: any };
  };

  /**
   * CLUI UI Component for this feature, can choose this component from list of CLUI Components
   * if no component is specified, this feature will be treated as a flag,
   * i.e as a boolean only on or off
   */

  constructor() {
    const inputFile = this.getCurrentFile();
    this.threads = getThreads();
    this.inputFile = inputFile;
    this.ffmpegCommands = '';
    this.outputFile = { name: `output-${inputFile.name}`, type: inputFile.type };
    this.setFFmpegInputCommand();
  }

  /**
   * Retrieves the current file name of the last modified file from the store
   */

  getCurrentFile = (): { name: string; type: FileTypes } => {
    // Get Current File Name from stores
    const { currentFile } = FileStore;
    return currentFile;
  };

  /**
   *  Sets the FFmpeg Input Command, this function can and
   * should be overwritten when special input cases are needed
   * By default, this function will set the current file as single file input
   * Check @link{commonInputTypes} to see already implemented functions for you
   */
  public setFFmpegInputCommand = () => {
    const currentFile = this.getCurrentFile();
    console.info('Setting FFmpeg Default Input Command', currentFile.name);
    this.ffmpegInputCommand = `-i ${currentFile.name}`;
  };

  /**
   * Sets FFmpeg Input Command for reading images for any function
   * **You will have to do further changes to the FFmpeg Command to use Images**
   * This command just loads the images
   */
  public imageInputType = (frameRate: number, ext: string) => {
    this.ffmpegInputCommand = `-framerate ${
      frameRate > 0 ? frameRate : 1
    } -pattern_type glob -i 'image*.${ext}'`;
  };

  /**
   * Sets FFmpeg Input Command for reading from input file
   * **Please make sure this works in FFmpeg first**
   * @param fileName A string that is the name of the text file
   * **Further text file expectation,**
   * A) Follow FFmpeg File Name Rules
   * B) Use FFmpeg WriteTxt to write the file to memory
   * Eg https://github.com/Etwas-Builders/ffmpeg.wasm/blob/ebdc295b4ab7e6412b4cdcbd31b9ceae0b9ad364/src/createFFmpeg.js#L114
   */
  public fileInputType = (fileName: string) => {
    this.ffmpegInputCommand = `-i ${fileName}`;
  };

  public commonInputTypes = {
    default: this.setFFmpegInputCommand,
    images: this.imageInputType,
    fileRead: this.fileInputType,
  };

  /**
    Calls FFmpeg with the given ffmpegCommands and appropriate inputFileName
   * @returns The file name of the processed file
   */

  public runFFmpeg = async (): Promise<CustomFileType> => {
    const { threads, outputFile, ffmpegCommands, ffmpegInputCommand } = this;

    const ffmpegData = { threads, outputFile, ffmpegCommands };
    console.info('Calling FFmpeg', ffmpegInputCommand, ffmpegData);
    const fileName = await ffmpegRunner(ffmpegInputCommand, ffmpegData);
    if (fileName) {
      updateCurrentFile(fileName);
      return fileName;
    }
    return this.inputFile;
  };

  /**
   * Changes the File Extension After this Feature is Executed
   *
   * **This Changes the format of video file, check formats folder to see supported formats**
   *
   * @param newExtension Expect a string of the format name **with the dot** Example .mp4, .avi
   */
  changeFileExtension = (newExtension: string): void => {
    this.outputFile.name = `output-${this.inputFile.name.split('.')[0]}${newExtension}`;
  };

  /**
   * Updates the video display parameter for a format, which determines
   * if it is showed in the video player or not.
   * @param displayType Expect a boolean of if the video format can be shown in an HTML5 <video> tag
   */
  updateDisplay = (displayType: boolean, type: string): void => {
    const { updateVideoDisplay, updateBlobType } = this.VideoStore;
    this.display = displayType;
    updateVideoDisplay(displayType);
    updateBlobType(type);
  };

  /**
   * Function sets the chosen progressBar values to the store
   */
  public updateProgress = () => {
    const { name, color } = this.progressBar;
    updateStatic(name, color);
  };

  /**
   * Expect Child Class to define this function to set ffmpegCommands property
   *
   * This method can take N number of arguments of any type
   */
  public abstract setFFmpegCommands(...args: any[]): void;

  /**
   *  Function Expected to parse the required values from
   * this.configuration and return to constructor
   *
   */
  public abstract parseConfiguration: () => { [name: string]: any };

  /**
   * Function is Expected to set the name and color of the progress bar for this feature
   * this.progressBar : { name: string; color: string}
   * This function is expected to be called in constructor
   */
  public abstract setProgress: () => void;

  /**
   * Function is Expected to the configuration of files for this feature
   * this.fileConfig :
   * {primaryType : string, types : [{name : string,number : {min : number, max : number}]}}
   */
  public abstract setFileConfig: () => void;
}

export default FFmpegFeature;

// eslint-disable-next-line no-undef
export type { FFmpegInterface };
