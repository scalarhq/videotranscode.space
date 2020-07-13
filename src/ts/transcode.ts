import { FormatType, CodecType } from "../types/formats";
import { ffmpegRunner, FFmpegDataType } from "./ffmpeg";
import { videoDisplay, progressType } from "../store/stores";

const handleNewTranscode = async (
  inputFileName: string,
  chosenFormat: FormatType,
  chosenCodec: CodecType,
  threads: number
) => {
  progressType.update(() => "Transcode");
  const { extension, display, defaultCodec } = chosenFormat;

  const outputFile = `${inputFileName}-output${extension}`;

  // If Format has a defaultCodec then it will be that
  let finalCodec = defaultCodec ? `-c:v ${defaultCodec.ffmpegLib}` : "";

  if (chosenCodec) {
    finalCodec = `-c:v ${chosenCodec.ffmpegLib}`;
  }

  const transcodeData: FFmpegDataType = {
    threads: threads,
    compress: "",
    outputFile: outputFile,
    outputCodec: finalCodec,
  };

  const processedVideoName = await ffmpegRunner(inputFileName, transcodeData);

  videoDisplay.update(() => display);

  return processedVideoName;
};

export { handleNewTranscode };
