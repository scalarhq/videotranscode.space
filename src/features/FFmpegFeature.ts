import { ffmpegRunner, FFmpegDataType } from '../ts/ffmpeg';

import ComponentStore from '../store/componentStore';

import { getThreads } from '../ts/hardware';

const { updateCurrentFile, ProgressStore } = ComponentStore;

const { updateStatic } = ProgressStore;

interface FFmpegInterface {
  configuration: {
    [name: string]: { value: any; [name: string]: any };
  };
  ffmpegCommands: string;
  threads: number;
  inputFileName: string;
  outputFileName: string;
  progressBar: { name: string; color: string };
  runFFmpeg: () => Promise<string>;
  getCurrentFileName: () => string;
  setFFmpegCommands: (...args: any[]) => void;
  parseConfiguration: () => { [name: string]: any };
  setProgress: () => void;
  updateProgress: () => void;
}

abstract class FFmpegFeature implements FFmpegInterface {
  public ffmpegCommands: string;

  public threads: number;

  public inputFileName: string;

  public outputFileName: string;

  public progressBar = { name: 'Processing....', color: '#0d6efd' };

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

  // /**
  //  * CLUI UI Component for this feature, can choose this component from list of CLUI Components
  //  * if no component is specified, this feature will be treated as a flag,
  //  * i.e as a boolean only on or off
  //  */
  // // public abstract ui: JSX.Element;

  constructor() {
    const inputFileName = this.getCurrentFileName();
    this.threads = getThreads();
    this.inputFileName = inputFileName;
    this.ffmpegCommands = '';
    this.outputFileName = `output-${inputFileName}`;
  }

  /**
   * Retrieves the current file name of the last modified file from the store
   */

  getCurrentFileName = (): string => {
    // Get Current File Name from stores
    const { currentFileName } = ComponentStore;
    return currentFileName;
  };

  /**
    Calls FFmpeg with the given ffmpegCommands and appropriate inputFileName
   * @returns The file name of the processed file
   */

  public runFFmpeg = async (): Promise<string> => {
    const { threads, outputFileName, ffmpegCommands } = this;

    const ffmpegData = { threads, outputFileName, ffmpegCommands };
    const fileName = await ffmpegRunner(this.inputFileName, ffmpegData);
    if (fileName) {
      updateCurrentFile(fileName);
      return fileName;
    }
    return this.inputFileName;
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
   *  This function is expected to be called in constructor
   */
  public abstract setProgress: () => void;
}

export default FFmpegFeature;

// eslint-disable-next-line no-undef
export type { FFmpegInterface };
