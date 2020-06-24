import { fileData } from "./file"
import { FFmpegDataType, operator } from "./ffmpeg";
import { FormatType } from "../types/formats";
import { videoDisplay } from "../store/stores";

const handleNewCompression = async (
    inputFile: File,
    format: FormatType,
    compressionValue: string,
    threads: number
) => {
    const { extension, display } = format;
    const inputExtension = "." + fileData.ext;
    const outputExtension = extension;
    const outputFile = `${inputFile.name}-output${inputExtension}`;

    const ffmpegInput: FFmpegDataType = {
        threads: threads,
        compress: compressionValue,
        outputFile: outputFile,
        outputCodec: ""
        };
    
    /** Displays the compressed video if no transcode operation was selected (format change) */
    const processedVideo = await operator(inputFile, ffmpegInput);
    if (inputExtension == outputExtension) {
        videoDisplay.update(() => display);
    }
    return processedVideo;
}

export { handleNewCompression };