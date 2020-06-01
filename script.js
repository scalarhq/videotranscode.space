const message = document.getElementById('message');
const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
  },
});

const transcode = async ({ target: { files }  }) => {
  const { name } = files[0];
  await console.log(name);
  message.innerHTML = 'Loading ffmpeg-core.js';
  await ffmpeg.load();
  message.innerHTML = 'Start transcoding';
  await console.log("it works")
  await ffmpeg.write(name, files[0]);
  await ffmpeg.transcode(name,  'output.mp4', '-threads 6');
  message.innerHTML = 'Complete transcoding';
  const data = ffmpeg.read('output.mp4');
 
  const video = document.getElementById('output-video');
  video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}
document.getElementById('uploader').addEventListener('change', transcode);