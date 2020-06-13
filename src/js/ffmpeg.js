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
  hardwareData
} from "../store/stores.js";

import {
  getFFmpegFlags, FORMAT_TYPES
} from "../store/configuration.js"

let configuration;
let min;
let max;
let sliderValue;
let compressionValue;

/** Triggers whenever the codec is changed */

config.subscribe((value) => {
  configuration = value;
  let currentCodec = configuration.codec;
  min = currentCodec.compressionRange.min;
  max = currentCodec.compressionRange.max;

  if (compressionValue && sliderValue) {
    /** Updates the slider value to the range of the current codec in case it is switched */
    compressionValue = (min + (((max - 1) * sliderValue) / 100));
    console.info(compressionValue);
  }


  console.log(
    `The new file format is ${configuration.format.name} and the chosen codec is ${configuration.codec.name}`
  );
});

/** Triggers whenver the slider is moved */
sliderStore.subscribe((value) => {
  sliderValue = value;
  /** Changes a 0-100 % range to a range between the minimum and maximum values for that codec */
  compressionValue = (min + (((max - 1) * sliderValue) / 100));
  console.info(compressionValue);
})

let fileInput;
let fileSize;

/** Triggers when a file is uploaded */
fileUploaded.subscribe((files) => {
  if (files) {
    fileInput = { target: { files: files } };
    fileSize = files[0].size;
    console.log(
      `The file ${files[0].name} is ready to be processed, please choose your settings`
    );
    showConfig.update((existing) => true);
  }
});

let encodeTime;
/** Loads the progress bar */
const { createFFmpeg } = FFmpeg;
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

let getThreads = () => {
  let threads = window.navigator.hardwareConcurrency;
  return threads;
}
/** Function that performs FFmpeg operations on the video */

let operation = async ({ target: { files } }) => {
  const start = new Date().getTime();
  const { name } = files[0];
  await console.info(name);

  terminalText.update((existing) => "Start processing");
  await ffmpeg.write(name, files[0]);
  /** Get the number of threads being used */
  let threads = getThreads();

  let grayscale = false;
  threads = threads < 8 ? threads : 8;

  console.info("Configuration", configuration);
  let { format, codec } = configuration;

  console.log(`The final settings are fileType ${format.name} with ${codec.name} and a compression level of ${sliderValue}%`);

  let { extension, type, display, defaultCodec } = format;

  let outputCodec = "";

  let params = "";

  params += grayscale ? `-vf hue=s=0` : "";

  /** Compression */
  let compress;

  if (sliderValue > 0) {
    /** TODO: Replace with getFFmpegFlags command from configuration.js once it's finished */
    compress = "-crf " + compressionValue;
  }

  videoDisplay.update((existing) => display);

  const output = `${files[0].name}-output${extension}`

  await ffmpeg.run(
    `-i ${name}  ${params} -threads ${threads} ${outputCodec} -strict -2 ${output} ${compress ? compress : ""}`
  );

  terminalText.update((existing) => "Complete processing");
  const data = ffmpeg.read(`${output}`);
  /** Creates the video object */
  
  let blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: type }));
  console.info(blobUrl);
  transcoded.update((existing) => blobUrl);
  clearTerminal.update((existing) => true);
  processed.update((existing) => true);
  /** Gets the time taken to process */
  const end = new Date().getTime();
  encodeTime = (end - start) / 1000;

  /** Gets data parameters */
  let threadsData = getThreads();
  let browserData = getBrowser();
  let inputFileSizeData = fileSize;
  let encodeTimeData = encodeTime;

  let currentData = {threads : threadsData, browser : browserData, inputFileSize : inputFileSizeData, encodeTime : encodeTimeData};
  hardwareData.update((existing) => currentData);
  console.info(currentData);
  
  console.log(
    `The processing is complete! Enjoy your video. It took ${
      encodeTime
    } seconds`
  );
};

let getBrowser = () => {
  let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  if (isOpera) {
    return "Opera";
  }

  let isFirefox = typeof InstallTrigger !== 'undefined';
  if (isFirefox) {
    return "Firefox";
  }

  let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  if (isSafari) {
    return "Safari";
  }

  let isIE = /*@cc_on!@*/false || !!document.documentMode;
  if (isIE) {
    return "Internet Explorer";
  }

  let isEdge = !isIE && !!window.StyleMedia;
  if (isEdge) {
    return "Edge";
  }

  let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  if (isChrome) {
    return "Chrome";
  }
}


/** Triggers once the submit button is pressed */
submit.subscribe((value) => {
  if (value) {
    operation(fileInput);
  }
});