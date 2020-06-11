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
  sliderStore
} from "../store/stores.js";

let configuration;
let min;
let max;

config.subscribe((value) => {
  configuration = value;
  let currentCodec = configuration.codec;
  min = currentCodec.compressionRange.min;
  max = currentCodec.compressionRange.max;
  console.log(
    `The new file format is ${configuration.format.name} and the chosen codec is ${configuration.codec.name}`
  );
});

let compressionValue;
sliderStore.subscribe((value) => {
  let sliderValue = value;
  compressionValue = (min + (((max - 1) * sliderValue) / 100));
  console.info(compressionValue);
  console.log(`The new compression level is ${sliderValue}%`);
})

let fileInput;

fileUploaded.subscribe((files) => {
  if (files) {
    fileInput = { target: { files: files } };
    console.log(
      `The file ${files[0].name} is ready to be processed, please choose your settings`
    );
    showConfig.update((existing) => true);
  }
});

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

(async () => {
  try {
    await ffmpeg.load();
  } catch (err) {
    alert(`Your Browser is not supported ${err.message}`);
  }
  console.info("Loaded!");
  loadedStore.update((existing) => true);
})();

let transcode = async ({ target: { files } }) => {
  const start = new Date().getTime();
  const { name } = files[0];
  await console.info(name);

  terminalText.update((existing) => "Start processing");
  await ffmpeg.write(name, files[0]);
  let threads = window.navigator.hardwareConcurrency;

  let grayscale = false;
  threads = threads < 8 ? threads : 8;

  console.info("Configuration", configuration);
  let { format, codec } = configuration;

  console.log(`The final settings are fileType ${format.name} with ${codec.name}`);

  let { extension, type, display, defaultCodec } = format;

  let outputCodec = "";

  let params = "";

  params += grayscale ? `-vf hue=s=0` : "";

  /** Compression */


  videoDisplay.update((existing) => display);

  await ffmpeg.run(
    `-i ${name}  ${params} -threads ${threads} ${outputCodec} -strict -2 output${extension} `
  );

  terminalText.update((existing) => "Complete processing");
  const data = ffmpeg.read(`output${extension}`);
  let blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: type }));
  console.info(blobUrl);
  transcoded.update((existing) => blobUrl);
  clearTerminal.update((existing) => true);
  processed.update((existing) => true);
  const end = new Date().getTime();
  console.log(
    `The processing is complete! Enjoy your video. It took ${
      (end - start) / 1000
    } seconds`
  );
};

submit.subscribe((value) => {
  if (value) {
    transcode(fileInput);
  }
});