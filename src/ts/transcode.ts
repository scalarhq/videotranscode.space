import { formatType, codecType } from "../types/formats";
import { operator, ffmpegDataType } from "./ffmpeg";
import { videoDisplay } from "../store/stores";

const handleNewTranscode = async (
  inputFile: File,
  chosenFormat: formatType,
  chosenCodec: codecType,
  threads: number
) => {
  const { extension, display, defaultCodec } = chosenFormat;

  const outputFile = `${inputFile.name}-output${extension}`;

  // If Format has a defaultCodec then it will be that
  let finalCodec = defaultCodec ? defaultCodec.ffmpegLib : "";

  if (chosenCodec) {
    finalCodec = chosenCodec.ffmpegLib;
  }

  const ffmpegInput: ffmpegDataType = {
    threads: threads,
    compress: "",
    outputFile: outputFile,
    outputCodec: finalCodec,
  };

  const processedVideo = await operator(inputFile, ffmpegInput);

  videoDisplay.update(() => display);

  return processedVideo;
};

export { handleNewTranscode };
