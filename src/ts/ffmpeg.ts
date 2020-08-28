import { createFFmpeg } from '@ffmpeg/ffmpeg';
import ComponentStore from '../store/componentStore';

import { CustomFileType } from '../types/fileTypes';

const { ProgressStore, updateLoaded, updateLoadError } = ComponentStore;
const { updateProgress } = ProgressStore;

export type FFmpegDataType = {
  outputFile: CustomFileType;
  threads: number;
  ffmpegCommands: string;
};

const ffmpeg = createFFmpeg({
  log: true,
  progress: (input: any) => {
    const value: number = input.ratio * 100.0;
    if (value > 0) {
      console.info(`Completed ${value.toFixed(2)}%`);
      updateProgress(value);
    }
  },
});

/** Checks if FFmpeg is supported on that browser */
const loadFFmpeg = async () => {
  try {
    await ffmpeg.load();
  } catch (err) {
    console.info('Error', window.navigator.userAgent, err.message);
    const loadError = new Error(
      `${err.message} This is because it either timed out or we do not support your browser yet. Please try reloading or using another browser, sorry for the inconvenience.`
    );
    updateLoadError(true, loadError);
  }
  updateLoaded(true);
};

/** *
 * FFmpeg Writer Loads a Video in WASM Memory for FFmpeg to use later
 * @param file is the actual inputted file from the user
 * @retuns The name of the file the user added
 */
const ffmpegWriter = async (file: File) => {
  const { name } = file;
  await ffmpeg.write(name, file);
  return name;
};

/** *
 * FFmpeg Reader Reads a Video from WASM Memory into JavaScript
 * @param fileName is the file name of the video which would like to be read
 * @return Uint8Array of data containing the file
 */
const ffmpegReader = async (fileName: string) => {
  const processedFile: Uint8Array = ffmpeg.read(`${fileName}`);
  return processedFile;
};

/** *
 * FFmpeg Runner Executes an FFmpeg Command in WASM
 * @param fileName is the name of the file on which the command is executed.
 * @param ffmpegData is the parameters of the executed and are of type {@link FFmpegDataType}
 * @return a file name as string of the processed file.
 */
const ffmpegRunner = async (inputFileCommand: string, ffmpegData: FFmpegDataType) => {
  const { outputFile, threads, ffmpegCommands } = ffmpegData;
  const commandString = `${inputFileCommand} -threads ${threads} ${ffmpegCommands} -strict -2 ${outputFile.name}`;
  console.log('Running FFmpeg', commandString);
  try {
    const promise = await ffmpeg.run(commandString);
    console.log('Returning output', promise);
    return outputFile;
  } catch (err) {
    console.trace();
    console.info(err.message);
  }
};

const ffmpegGarbageCollector = async (oldFileNames: Array<string>) => {
  for (const oldFile of oldFileNames) {
    if (oldFile) {
      // eslint-disable-next-line no-await-in-loop
      await ffmpeg.remove(oldFile);
    }
  }
};

export { loadFFmpeg, ffmpegRunner, ffmpegReader, ffmpegWriter, ffmpegGarbageCollector };
