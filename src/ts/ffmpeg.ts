import { loadedStore, progressStore } from "../store/stores";
// import "../../public/ffmpeg.min.js";
//@ts-ignore: Already Loaded into Scope
import { createFFmpeg } from "@ffmpeg/ffmpeg";

//@ts-ignore: Already Loaded into Scope
// const { createFFmpeg } = FFmpeg;

/** Loads the progress bar */

type FFmpegDataType = {
  outputFile: string;
  threads: number;
  outputCodec: string;
  compress: string;
};
//@ts-ignore Defined later
const exportedElements: {
  ffmpegWriter: (file: File) => Promise<string>;
  ffmpegReader: (fileName: string) => Promise<Uint8Array>;
  ffmpegRunner: (
    fileName: string,
    ffmpegData: FFmpegDataType
  ) => Promise<string>;
} = {};

if (window.navigator.userAgent.includes("jsdom")) {
  // This is a testing environment and not a production environment.

  // Mock Functions

  const mockWriter = async (file: File) => {
    return "mock-name";
  };
  const mockReader = async (filename: string) => {
    const newMockArray = new Uint8Array();
    return newMockArray;
  };
  const mockRunner = async (fileName: string, ffmpegData: FFmpegDataType) => {
    return "processed-mock-name";
  };
  exportedElements.ffmpegRunner = mockRunner;
  exportedElements.ffmpegReader = mockReader;
  exportedElements.ffmpegWriter = mockWriter;
} else {
  const ffmpeg = createFFmpeg({
    log: true,
    progress: (input: any) => {
      const value: number = input.ratio * 100.0;
      if (value > 0) {
        console.info(`Completed ${value.toFixed(2)}%`);
        progressStore.update(() => value);
      }
    },
  });

  /** Checks if FFmpeg is supported on that browser */
  (async () => {
    try {
      await ffmpeg.load();
    } catch (err) {
      console.error(window.navigator.userAgent, err.message);
      alert(`Your Browser is not supported ${err.message}`);
    }
    loadedStore.update(() => true);
  })();

  const ffmpegWriter = async (file: File) => {
    const { name } = file;
    await ffmpeg.write(name, file);
    return name;
  };

  const ffmpegReader = async (fileName: string) => {
    const processedFile: Uint8Array = ffmpeg.read(`${fileName}`);
    return processedFile;
  };

  /** FFmpeg Runner
   *
   */

  const ffmpegRunner = async (fileName: string, ffmpegData: FFmpegDataType) => {
    const { outputFile, threads, outputCodec, compress } = ffmpegData;
    await ffmpeg.run(
      `-i '${fileName}'  -threads ${threads} ${outputCodec} -strict -2 ${outputFile} ${
        compress ? compress : ""
      }`
    );
    return outputFile;
  };
  exportedElements.ffmpegRunner = ffmpegRunner;
  exportedElements.ffmpegReader = ffmpegReader;
  exportedElements.ffmpegWriter = ffmpegWriter;
}

const { ffmpegRunner, ffmpegReader, ffmpegWriter } = exportedElements;

export { ffmpegRunner, ffmpegReader, ffmpegWriter, FFmpegDataType };
