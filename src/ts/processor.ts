import {
  transcoded,
  terminalText,
  clearTerminal,
  processed,
  config,
  submit,
  sliderStore
} from "../store/stores";
import "../ts/form";

import { ConfigurationType, FinalSettingsType } from "../types/formats";

import { handleNewTranscode } from "./transcode";
import { handleNewCompression } from "./compression";
import { updateData, getThreads } from "./hardware";
import { fileInput, fileData } from "./file";

let configuration: ConfigurationType;
let min = 0;
let max = 0;
let sliderValue = 0;
let compressionValue = 0;

/** Triggers whenever the codec or format is changed */
config.subscribe((value: any) => {
  configuration = value;
  let currentCodec = configuration.codec;
  min = currentCodec.compressionRange.min;
  max = currentCodec.compressionRange.max;

  if (sliderValue > 0 && compressionValue > 0) {
    /** Updates the slider value to the range of the new codec in case the codec is switched */
    compressionValue = min + ((max - 1) * sliderValue) / 100;
  }

  console.log(
    `The new file format is ${configuration.format.name} and the chosen codec is ${configuration.codec.name}`
  );
});

/** Triggers whenever the slider is moved */
sliderStore.subscribe((value) => {
  sliderValue = value;
  console.log(`The new compression level is ${sliderValue}%`);
  /** Changes a 0-100 % range to a range between the minimum and maximum values for the chosen codec */
  compressionValue = min + ((max - 1) * sliderValue) / 100;
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

  let toTranscode = false;

  const inputExtension = "." + fileData.ext;
  const outputExtension = format.extension;

  if (inputExtension != outputExtension) {
    toTranscode = true;
  }

  let transcodedVideo;
  if (sliderValue > 0) {
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
