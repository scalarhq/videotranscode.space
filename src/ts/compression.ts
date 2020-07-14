import { fileData } from './file';
import { progressType } from '../store/stores';
import { FFmpegDataType, ffmpegRunner } from './ffmpeg';
import { finalConfiguration } from './configuration';

const handleNewCompression = async (inputFileName: string, threads: number) => {
  progressType.update(() => 'Compress');
  const { compressionValue } = finalConfiguration;
  const inputExtension = '.' + fileData.ext;
  const outputFile = `${inputFileName}-output${inputExtension}`;

  const finalCompressionValue = `-crf ${compressionValue}`;

  const compressionData: FFmpegDataType = {
    threads: threads,
    compress: finalCompressionValue,
    outputFile: outputFile,
    outputCodec: '',
  };

  /** Displays the compressed video if no transcode operation was selected (format change) */
  const processedVideoName = await ffmpegRunner(inputFileName, compressionData);
  return processedVideoName;
};

export { handleNewCompression };
