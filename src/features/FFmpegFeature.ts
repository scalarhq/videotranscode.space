/**
 *  All the documentation for this file is available in the interface it implements
 *  {@link FFmpegInterface}
 * @packageDocumentation
 */

import { ffmpegRunner } from '../ts/ffmpeg';

import ComponentStore from '../store/componentStore';

import { getThreads } from '../ts/hardware';

import FFmpegInterface from './FFmpegInterface';

import { FileTypes, CustomFileType } from '../types/fileTypes';

const { FileStore, ProgressStore, VideoStore } = ComponentStore;

const { updateStatic } = ProgressStore;

const { updateCurrentFile } = FileStore;

abstract class FFmpegFeature implements FFmpegInterface {
  // Stores
  public FileStore = FileStore;

  public VideoStore = VideoStore;

  public ComponentStore = ComponentStore;

  // Values

  public ffmpegCommands: string;

  public threads: number;

  public inputFile: { name: string; type: FileTypes } = { name: '', type: 'video' };

  public outputFile: { name: string; type: FileTypes } = { name: '', type: 'video' };

  public progressBar = { name: 'Processing....', color: '#0d6efd' };

  public ffmpegInputCommand = '';

  public display: boolean = false;

  public fileConfig = {
    primaryType: 'video',
    types: [{ name: 'video', number: { min: 1, max: -1 } }],
  };

  public abstract configuration: {
    [name: string]: { value: any; [name: string]: any };
  };

  constructor() {
    const inputFile = this.getCurrentFile();
    this.threads = getThreads();
    this.inputFile = inputFile;
    this.ffmpegCommands = '';
    this.outputFile = { name: `output-${inputFile.name}`, type: inputFile.type };
    this.setFFmpegInputCommand();
  }

  getCurrentFile = (): { name: string; type: FileTypes } => {
    // Get Current File Name from stores
    const { currentFile } = FileStore;
    return currentFile;
  };

  public setFFmpegInputCommand = () => {
    const currentFile = this.getCurrentFile();
    console.info('Setting FFmpeg Default Input Command', currentFile.name);
    this.ffmpegInputCommand = `-i ${currentFile.name}`;
  };

  public imageInputType = (frameRate: number, ext: string) => {
    this.ffmpegInputCommand = `-framerate ${
      frameRate > 0 ? frameRate : 1
    } -pattern_type glob -i 'image*.${ext}'`;
  };

  public fileInputType = (fileName: string) => {
    this.ffmpegInputCommand = `-i ${fileName}`;
  };

  public commonInputTypes = {
    default: this.setFFmpegInputCommand,
    images: this.imageInputType,
    fileRead: this.fileInputType,
  };

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

  changeFileExtension = (newExtension: string): void => {
    this.outputFile.name = `output-${this.inputFile.name.split('.')[0]}${newExtension}`;
  };

  updateDisplay = (displayType: boolean, type: string): void => {
    const { updateVideoDisplay, updateBlobType } = this.VideoStore;
    this.display = displayType;
    updateVideoDisplay(displayType);
    updateBlobType(type);
  };

  public updateProgress = () => {
    const { name, color } = this.progressBar;
    updateStatic(name, color);
  };

  public abstract setFFmpegCommands(...args: any[]): void;

  public abstract parseConfiguration: () => { [name: string]: any };

  public abstract setProgress: () => void;

  public abstract setFileConfig: () => void;
}

export default FFmpegFeature;

// eslint-disable-next-line no-undef
export type { FFmpegInterface };
