/* eslint-disable prettier/prettier */
import { ffmpegRunner, FFmpegDataType } from '../notIntegrated/ts/ffmpeg';

import { getThreads } from '../notIntegrated/ts/hardware';

interface FFmpegInterface {
  ffmpegCommands: string;
  threads: number;
  inputFileName: string;
  outputFileName: string;
  runFFmpeg: () => Promise<string>;
  getCurrentFileName: () => string;
  setFFmpegCommands: (...args: any[]) => void;
}

abstract class FFmpegFeature implements FFmpegInterface {
  public ffmpegCommands: string;

  public threads: number;

  public inputFileName: string;

  public outputFileName: string;

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
    const currentFileName = '';
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

    return fileName;
  };

  /**
   * Expect Child Class to define this function to set ffmpegCommands property
   *
   * This method can take N number of arguments of any type
   */

  public abstract setFFmpegCommands(...args: any[]): void;
}

export default FFmpegFeature;

// eslint-disable-next-line no-undef
export type { FFmpegInterface };
