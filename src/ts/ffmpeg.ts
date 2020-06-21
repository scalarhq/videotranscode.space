import { loadedStore, progressStore } from "../store/stores";
// import FFmpeg from "../../public/ffmpeg.min";

//@ts-ignore: Already Loaded into Scope
const { createFFmpeg } = FFmpeg;

/** Loads the progress bar */

const ffmpeg = createFFmpeg({
  log: true,
  progress: (input: any) => {
    const value: number = input.ratio * 100.0;
    if (value > 0) {
      console.info(`Completed ${value.toFixed(2)}%`);
      progressStore.update((exisiting) => value);
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
  console.info("Loaded!");
  loadedStore.update((exisiting) => true);
})();

type ffmpegDataType = {
  outputFile: string;
  threads: number;
  outputCodec: string;
  compress: string;
};

/** FFmpeg Runner
 *
 */

const operator = async (file: File, ffmpegData: ffmpegDataType) => {
  const { name } = file;
  const { outputFile, threads, outputCodec, compress } = ffmpegData;
  await ffmpeg.write(name, file);
  await ffmpeg.run(
    `-i '${name}'  -threads ${threads} ${outputCodec} -strict -2 ${outputFile} ${
      compress ? compress : ""
    }`
  );
  const processedFile = ffmpeg.read(`${outputFile}`);
  return processedFile;
};

export { operator, ffmpegDataType };
