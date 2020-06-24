import { fileData } from "./file"
import { FFmpegDataType, operator } from "./ffmpeg";
import { FormatType } from "../types/formats";
import { videoDisplay } from "../store/stores";

const handleNewCompression = async (
    inputFile: File,
    compressionValue: string,
    threads: number
) => {
    const inputExtension = "." + fileData.ext;
    const outputFile = `${inputFile.name}-output${inputExtension}`;

    const ffmpegInput: FFmpegDataType = {
        threads: threads,
        compress: compressionValue,
        outputFile: outputFile,
        outputCodec: ""
        };
    
    /** Displays the compressed video if no transcode operation was selected (format change) */
    const processedVideo = await operator(inputFile, ffmpegInput);
    const data = {name: outputFile, video: processedVideo};
    return data;
}

export { handleNewCompression };