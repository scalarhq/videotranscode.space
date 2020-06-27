import { FormatType, CodecType } from "../types/formats";
import { operator, FFmpegDataType } from "./ffmpeg";
import { videoDisplay, progressType } from "../store/stores";

const handleNewTranscode = async (
  inputFile: File | Uint8Array,
  chosenFormat: FormatType,
  chosenCodec: CodecType,
  threads: number,
  name?: string
) => {
  progressType.update(() => "Transcode");
  const { extension, display, defaultCodec } = chosenFormat;

  let outputFile;
  if (inputFile instanceof File) {
    outputFile = `${inputFile.name}-output${extension}`;
  } else {
    outputFile = `output${extension}`;
  }

  // If Format has a defaultCodec then it will be that
  let finalCodec = defaultCodec ? `-c:v ${defaultCodec.ffmpegLib}` : "";

  if (chosenCodec) {
    finalCodec = `-c:v ${chosenCodec.ffmpegLib}`;
  }

  const ffmpegInput: FFmpegDataType = {
    threads: threads,
    compress: "",
    outputFile: outputFile,
    outputCodec: finalCodec,
  };

  let processedVideo;

  if (inputFile instanceof File) {
    processedVideo = await operator(inputFile, ffmpegInput);
  } else {
    console.info(name);
    processedVideo = await operator(inputFile, ffmpegInput, name);
  }

  videoDisplay.update(() => display);

  return processedVideo;
};

export { handleNewTranscode };
