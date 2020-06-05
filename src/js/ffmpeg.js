import {
  loadedStore,
  fileUploaded,
  transcoded,
  terminalText,
  clearTerminal,
} from "../store/stores.js";

import format from "./formats.json";


const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    let value = (ratio * 100.0).toFixed(2);
    if (value > 0) {
      //   terminalText.update((existing) => `Complete: ${value}%`);
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
  await console.info("it works");
  await ffmpeg.write(name, files[0]);
  let threads = window.navigator.hardwareConcurrency;
  //let grayscale = document.getElementById("grayscale").checked;
  let grayscale = false;
  threads = threads < 8 ? threads : 8;

  await ffmpeg.run(
    `-i ${name} ${
      grayscale ? `-vf hue=s=0` : ""
    }   -threads ${threads} -strict -2 output.mov `
  );

  terminalText.update((existing) => "Complete processing");
  const data = ffmpeg.read("output.mov");
  let blobUrl = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mov" })
  );
  console.info(blobUrl)
  transcoded.update((existing) => blobUrl);
  clearTerminal.update((existing) => true);

  const end = new Date().getTime();
  // terminalText.update(
  //   (existing) =>
  //     `The processing is complete! Enjoy your video. It took ${
  //       (end - start) / 1000
  //     } seconds`
  // );
  console.log(
    `The processing is complete! Enjoy your video. It took ${
      (end - start) / 1000
    } seconds`
  );
};

fileUploaded.subscribe((files) => {
  transcode({ target: { files: files } });
});
