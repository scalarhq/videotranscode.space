import {
  loadedStore,
  fileUploaded,
  transcoded,
  terminalText,
  clearTerminal,
  videoDisplay,
  submit,
  showConfig,
  processed,
  progressStore,
  config,
  sliderStore,
  hardwareData,
} from "../store/stores.js";

import {
  getBrowser,
  getThreads,
  sizeHumanReadable,
  getOs,
  getNavigator,
} from "./hardware";

// import { getFFmpegFlags, FORMAT_TYPES } from "../store/configuration.js";

let configuration;
let min;
let max;
let sliderValue;
let compressionValue;
let fileInput;
const fileData = {};
const finalSettings = {};

const { createFFmpeg } = FFmpeg;
let encodeTime;
/** Triggers whenever the codec is changed */

config.subscribe((value) => {
  configuration = value;
  let currentCodec = configuration.codec;
  min = currentCodec.compressionRange.min;
  max = currentCodec.compressionRange.max;

  if (compressionValue && sliderValue) {
    /** Updates the slider value to the range of the current codec in case it is switched */
    compressionValue = min + ((max - 1) * sliderValue) / 100;
    console.info(compressionValue);
  }

  console.log(
    `The new file format is ${configuration.format.name} and the chosen codec is ${configuration.codec.name}`
  );
});

/** Triggers whenever the slider is moved */
sliderStore.subscribe((value) => {
  sliderValue = value;
  /** Changes a 0-100 % range to a range between the minimum and maximum values for that codec */
  compressionValue = min + ((max - 1) * sliderValue) / 100;
  console.info(compressionValue);
});

/** Triggers when a file is uploaded */
fileUploaded.subscribe((files) => {
  if (files) {
    fileInput = { target: { files: files } };
    fileData["size"] = files[0].size;
    let ext = files[0].name.split(".")[1];
    fileData["ext"] = ext;
    console.log(
      `The file ${files[0].name} is ready to be processed, please choose your settings`
    );
    showConfig.update((existing) => true);
  }
});

/** Loads the progress bar */

const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    let value = (ratio * 100.0).toFixed(2);
    if (value > 0) {
      console.info(`Completed ${value}%`);
      progressStore.update((existing) => value);
    }
  },
});

/** Checks if FFmpeg is supported on that browser */
(async () => {
  try {
    await ffmpeg.load();
  } catch (err) {
    alert(`Your Browser is not supported ${err.message}`);
  }
  console.info("Loaded!");
  loadedStore.update((existing) => true);
})();

/** Function that performs the FFmpeg transcode on the video */
let transcode = async ({ target: { files } }) => {
  const start = new Date().getTime();

  let settings = await chooseSettings(files);

  let name = settings[0];
  let threads = settings[1];
  let format = settings[2];

  let { extension, type, display, defaultCodec } = format;
  let outputCodec = "";
  let params = "";
  let grayscale = false;
  params += grayscale ? `-vf hue=s=0` : "";

  /** Compression */
  let compress = "";

  if (sliderValue > 0) {
    /** TODO: Replace with getFFmpegFlags command from configuration.js once it's finished */
    compress = "-crf " + compressionValue;
  }

  videoDisplay.update((existing) => display);
  const output = `${files[0].name}-output${extension}`;
  
  console.info(compress);


  await ffmpeg.run(
    `-i ${name}  ${params} -threads ${threads} ${outputCodec} -strict -2 ${output} ${
      compress
    }`
  );

  terminalText.update((existing) => "Complete processing");
  const data = ffmpeg.read(`${output}`);
  
  createVideo(data, type);
  /** Gets the time taken to process */
  const end = new Date().getTime();
  encodeTime = (end - start) / 1000;

  updateData(encodeTime);

  console.log(
    `The processing is complete! Enjoy your video. It took ${encodeTime} seconds`
  );
};

/** The function that allows users to select formats and codecs */
const chooseSettings = async (files) => {
  let settings = [];

  const { name } = files[0];
  /** Index 0 is the name */
  settings.push(name);

  await console.info(name);
  terminalText.update((existing) => "Start processing");
  await ffmpeg.write(name, files[0]);
  /** Get the number of threads being used */
  let threads = getThreads();

  /** Index 1 is the number of threads */
  threads = threads < 8 ? threads : 8;
  settings.push(threads);

  console.info("Configuration", configuration);
  let { format, codec } = configuration;
  /** Index 2 is the format */
  settings.push(format);
  console.info("Format");

  console.log(
    `The final settings are fileType ${format.name} with ${codec.name} and a compression level of ${sliderValue}%`
  );
  finalSettings.format = format.name;
  finalSettings.codec = codec.name;

  return settings;
}

/** Creates the video object */
const createVideo = (data, type) => {
  let blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: type }));
  console.info(blobUrl);
  transcoded.update((existing) => blobUrl);
  clearTerminal.update((existing) => true);
  processed.update((existing) => true);
}

const updateData = (encodeTime) => {
  /** Gets data parameters */
  let threadsData = getThreads();
  let os = getOs();
  let navigator = getNavigator();
  let browserData = getBrowser();
  let inputFileSizeData = sizeHumanReadable(fileData.size);
  let encodeTimeData = encodeTime;

  let currentData = {
    inputFileSize: inputFileSizeData,
    encodeTime: encodeTimeData,
    threads: threadsData,
    inputFileFormat: fileData.ext,
    outputFileFormat: finalSettings.format,
    outputFileCodec: finalSettings.codec,
    browser: browserData,
    os: os,
    navigator: navigator,
  };
  hardwareData.update((existing) => currentData);
};

/** Triggers once the submit button is pressed */
submit.subscribe((value) => {
  if (value) {
    /**if (compressionValue > 0) {
      compress(fileInput);
    }**/
    transcode(fileInput);
  }
});
