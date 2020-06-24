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

/** FFmpeg Runner
 *
 */

const operator = async (file: File | Uint8Array, ffmpegData: FFmpegDataType, inputName?: string) => {
  const { outputFile, threads, outputCodec, compress } = ffmpegData;
  if (file instanceof File) {
    const { name } = file;
    await ffmpeg.write(name, file);
    await ffmpeg.run(
      `-i '${name}'  -threads ${threads} ${outputCodec} -strict -2 ${outputFile} ${
        compress ? compress : ""
      }`
    );
  } else if (file instanceof Uint8Array) {
    console.info("Uint8Array!");
    await ffmpeg.run(
      `-i '${inputName}'  -threads ${threads} ${outputCodec} -strict -2 ${outputFile} ${
        compress ? compress : ""
      }`
  }
  
  const processedFile = ffmpeg.read(`${outputFile}`);
  return processedFile;
};

export { operator, FFmpegDataType };
