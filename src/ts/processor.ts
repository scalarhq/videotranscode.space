import {
  transcoded,
  terminalText,
  clearTerminal,
  processed,
  submit,
} from "../store/stores";
import "../ts/form";

import { ConfigurationType, FinalSettingsType } from "../types/formats";
import { ffmpegWriter, ffmpegReader } from "./ffmpeg";
import { handleNewTranscode } from "./transcode";
import { handleNewCompression } from "./compression";
import { updateData, getThreads } from "./hardware";
import { fileInput, fileData } from "./file";
import { finalConfiguration } from "./configuration";

const handleSubmit = async () => {
  const { configuration, sliderValue } = finalConfiguration;
  const start = new Date().getTime();

  terminalText.update(() => "Start processing");

  const { format, codec } = configuration;

  const finalSettings: FinalSettingsType = {
    format: format.name,
    codec: codec.name,
  };

  const threads = getThreads();

  console.log(
    `The final settings are fileType ${format.name} with ${codec.name}`
  );

  const inputExtension = "." + fileData.ext;
  const outputExtension = format.extension;
  const toTranscode = inputExtension != outputExtension ? true : false;

  /***
   * Load Input File to FFmpeg
   */

  const inputFileName: string = await ffmpegWriter(fileInput);
  let outputVideoName: string;

  if (sliderValue > 0) {
    // Compressing Workflow
    outputVideoName = await handleNewCompression(inputFileName, threads);

    if (toTranscode) {
      /** Pass video to transcode */
      outputVideoName = await handleNewTranscode(
        outputVideoName,
        format,
        codec,
        threads
      );
    }
  } else {
    outputVideoName = await handleNewTranscode(
      inputFileName,
      format,
      codec,
      threads
    );
  }

  const processedVideo = await ffmpegReader(outputVideoName);

  terminalText.update(() => "Complete processing");

  createVideoObject(processedVideo, format.type);
  clearTerminal.update(() => true);
  processed.update(() => true);
  const end = new Date().getTime();
  const encodeTime = (end - start) / 1000;
  updateData(encodeTime, fileData, finalSettings);
  console.log(
    `The processing is complete! Enjoy your video. It took ${encodeTime} seconds`
  );
};

const createVideoObject = (processedFile: Uint8Array, videoType: string) => {
  const blobUrl = URL.createObjectURL(
    new Blob([processedFile.buffer], { type: videoType })
  );
  console.info(blobUrl);
  transcoded.update(() => blobUrl);
};

export { handleSubmit };

/** Triggers once the submit button is pressed */
submit.subscribe((value: boolean) => {
  if (value) {
    handleSubmit();
  }
});
