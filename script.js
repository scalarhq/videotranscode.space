const message = document.getElementById("message");
var t1 = new Terminal();
t1.setWidth("1130px");
t1.setBackgroundColor("#263238");
t1.setTextColor("#76ff03");
t1.blinkingCursor(true);
t1.html.style.fontFamily = "Ubuntu Mono";

let terminalDiv = document.getElementById("terminal");
terminalDiv.appendChild(t1.html);
t1.print("Hello, I am an FFmpeg Wasm Video Transcoder");

if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
  // Do Firefox-related activities
  alert(`Your Browser is not supported`);
  document.getElementById("inner-loader").style.display = "none";
  message.innerText = "Firefox is not supported!";
}

const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    let value = (ratio * 100.0).toFixed(2);
    if (value > 0) {
      t1.print(`Complete: ${value}%`);
    }
  },
});
(async () => {
  try {
    await ffmpeg.load();
  } catch (err) {
    alert(`Your Browser is not supported ${err.message}`);
  }
  console.log("Loaded!");
  document.getElementById("loader").style.display = "none";
  document.getElementById("body").style.display = "block";
  t1.print("Loading ffmpeg-core.js...");
})();

const transcode = async ({ target: { files } }) => {
  const { name } = files[0];
  await console.log(name);
  document.getElementById("filename").innerText = name;

  t1.print("Start processing");
  await console.log("it works");
  await ffmpeg.write(name, files[0]);
  let threads = window.navigator.hardwareConcurrency;
  let grayscale = document.getElementById("grayscale").checked;
  threads = threads < 8 ? threads : 8;

  await ffmpeg.run(
    `-i ${name} ${
      grayscale ? `-vf hue=s=0` : ""
    } output.mp4 -threads ${threads}`
  );
  t1.print("Complete processing");
  const data = ffmpeg.read("output.mp4");

  const video = document.getElementById("output-video");
  // const videoSrc = document.getElementById("video-src");
  const download = document.getElementById("download");
  download.style.display = "block";
  video.style.display = "block";
  blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
  video.src = blobUrl;
  download.href = blobUrl;
  t1.clear();
  t1.print("The processing is complete! Enjoy your video");
};
document.getElementById("uploader").addEventListener("change", transcode);
