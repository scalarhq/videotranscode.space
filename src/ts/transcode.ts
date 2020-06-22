import { FormatType, CodecType } from "../types/formats";
import { operator, FFmpegDataType } from "./ffmpeg";
import { videoDisplay } from "../store/stores";

const handleNewTranscode = async (
  inputFile: File,
  chosenFormat: FormatType,
  chosenCodec: CodecType,
  threads: number
) => {
  const { extension, display, defaultCodec } = chosenFormat;

  const outputFile = `${inputFile.name}-output${extension}`;

  // If Format has a defaultCodec then it will be that
  let finalCodec = defaultCodec ? defaultCodec.ffmpegLib : "";

  if (chosenCodec) {
    finalCodec = chosenCodec.ffmpegLib;
  }

  const ffmpegInput: FFmpegDataType = {
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
