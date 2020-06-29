import { loadedStore, progressStore } from "../store/stores";

//@ts-ignore: Already Loaded into Scope
const { createFFmpeg } = FFmpeg;

/** Loads the progress bar */

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
    alert(`Your Browser is not supported ${err.message}`);
  }
  loadedStore.update(() => true);
})();

type FFmpegDataType = {
  outputFile: string;
  threads: number;
  outputCodec: string;
  compress: string;
};

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

export { ffmpegRunner, ffmpegReader, ffmpegWriter, FFmpegDataType };
