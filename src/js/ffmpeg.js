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

/** Function that performs the FFmpeg transcode command on the video */
let transcode = async ({ target: { files } }) => {
  const start = new Date().getTime();

  let settings = await chooseSettings(files);
  let name = settings[0];
  let threads = settings[1];
  let format = settings[2];
  let codec = settings[3];
  let { extension, type, display, defaultCodec } = format;

  let outputCodec = await setCodec(codec, defaultCodec);
  console.info(outputCodec);

  videoDisplay.update((existing) => display);
  const output = `${files[0].name}-output${extension}`;

  await ffmpeg.run(
    `-i ${name} -threads ${threads} ${outputCodec} -strict -2 ${output}`
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

/** Function that performs the FFmpeg compress command on the video */
let compression = async ({ target: { files } }) => {
  const start = new Date().getTime();

  let settings = await chooseSettings(files);
  let name = settings[0];
  let threads = settings[1];
  let format = settings[2];

  let { extension, type, display, defaultCodec } = format;
  let outputCodec = "";

  /** Compression */
  let compress = "";

  if (sliderValue > 0) {
    compress = "-crf " + compressionValue;
  }

  videoDisplay.update((existing) => display);
  const output = `${files[0].name}-output${extension}`;

  await ffmpeg.run(
    `-i ${name} -threads ${threads} ${outputCodec} -strict -2 ${output} ${
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

let setCodec = async (codec, defaultCodec) => {
  let outputCodec = "";
  console.log(codec);
  console.log(defaultCodec);
  if (codec) {
    console.info("Selected Codec", codec);
    let ffmpegLib = codec.ffmpegLib;
    console.info(ffmpegLib);
    outputCodec = `-c:v ${ffmpegLib}`;
    console.info(outputCodec);
  } else if (defaultCodec) {
    console.info("Default Codec", defaultCodec);
    let ffmpegLibs = defaultCodec.ffmpegLibs;
    outputCodec = `-c:v ${ffmpegLibs}`;
  }
  return outputCodec;
}

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
  /** Index 3 is the chosen codec */
  settings.push(codec);

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
