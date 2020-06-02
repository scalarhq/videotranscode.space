const message = document.getElementById("message");
var t1 = new Terminal();
t1.setWidth("1130px");
t1.setBackgroundColor("black");
t1.blinkingCursor(true);
let terminalDiv = document.getElementById("terminal");
terminalDiv.appendChild(t1.html);
t1.print("Hello, I am an FFmpeg Wasm Video Editor");

const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    t1.print(`Complete: ${(ratio * 100.0).toFixed(2)}%`);
  },
});

const transcode = async ({ target: { files } }) => {
  const { name } = files[0];
  await console.log(name);
  message.innerHTML = "Loading ffmpeg-core.js";
  await ffmpeg.load();
  message.innerHTML = "Start transcoding";
  await console.log("it works");
  await ffmpeg.write(name, files[0]);
  await ffmpeg.run(`-i ${name} -vf hue=s=0 output.mp4 -threads 6`);
  message.innerHTML = "Complete transcoding";
  const data = ffmpeg.read("output.mp4");

  const video = document.getElementById("output-video");
  // const videoSrc = document.getElementById("video-src");
  const download = document.getElementById("download");
  download.style.display = "block";
  video.style.display = "block";
  blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
  video.src = blobUrl;
  download.href = blobUrl;
};
document.getElementById("uploader").addEventListener("change", transcode);
