import {
  transcoded,
  terminalText,
  clearTerminal,
  processed,
  config,
  submit,
} from "../store/stores";

import { ConfigurationType, FinalSettingsType } from "../types/formats";

import { handleNewTranscode } from "./transcode";
import { updateData, getThreads } from "./hardware";
import { fileInput, fileData } from "./file";

let configuration: ConfigurationType;

/** Triggers whenever the codec or format is changed */
config.subscribe((value: any) => {
  configuration = value;
  console.log(
    `The new file format is ${configuration.format.name} and the chosen codec is ${configuration.codec.name}`
  );
});

const handleSubmit = async () => {
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

  /** Compression - Transcode Logic goes here
   *
   */
  const transcodedVideo = await handleNewTranscode(
    fileInput,
    format,
    codec,
    threads
  );
  terminalText.update(() => "Complete processing");

  createVideoObject(transcodedVideo, format.type);
  clearTerminal.update(() => true);
  processed.update(() => true);
  const end = new Date().getTime();
  const encodeTime = (end - start) / 1000;
  updateData(encodeTime, fileData, finalSettings);
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
