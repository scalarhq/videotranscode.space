import {
  transcoded,
  terminalText,
  clearTerminal,
  processed,
  submit,
} from "../store/stores";
import "../ts/form";

import { ConfigurationType, FinalSettingsType } from "../types/formats";

import { handleNewTranscode } from "./transcode";
import { handleNewCompression } from "./compression";
import { updateData, getThreads } from "./hardware";
import { fileInput, fileData } from "./file";
import { finalConfiguration } from "./configuration";

const handleSubmit = async () => {
  const { configuration, sliderValue, compressionValue } = finalConfiguration;
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

  let toTranscode = false;

  const inputExtension = "." + fileData.ext;
  const outputExtension = format.extension;

  if (inputExtension != outputExtension) {
    toTranscode = true;
  }

  let transcodedVideo;
  if (sliderValue > 0) {
    console.info("Compressing");
    const finalCompressionValue = "-crf " + compressionValue.toString();
    const data = await handleNewCompression(
      fileInput,
      finalCompressionValue,
      threads
    );
    const compressionOutput = data.name;
    const video = data.video;

    if (toTranscode) {
      /** Pass video to transcode */
      transcodedVideo = await handleNewTranscode(
        video,
        format,
        codec,
        threads,
        compressionOutput
      );
    }
  } else {
    transcodedVideo = await handleNewTranscode(
      fileInput,
      format,
      codec,
      threads
    );
  }

  terminalText.update(() => "Complete processing");

  createVideoObject(transcodedVideo, format.type);
  clearTerminal.update(() => true);
  processed.update(() => true);
  const end = new Date().getTime();
  const encodeTime = (end - start) / 1000;
  updateData(encodeTime, fileData, finalSettings);
  console.log(
    `The processing is complete! Enjoy your video. It took ${encodeTime} seconds`
  );
};

const createVideoObject = (processedFile: any, videoType: string) => {
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
