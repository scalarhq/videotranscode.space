const ytsr = require("ytsr");
const fs = require("fs");
const ytdl = require("ytdl-core");

const getVideoUrl = async () => {
  const channels = [
    // "PewDiePie",
    // "Linus Tech Tips",
    // "Philip DeFranco",
    // "David Dobrik",
    "Bread Boys",
  ];
  const currentChannel = channels[Math.floor(Math.random() * channels.length)];
  console.log(currentChannel);
  const data = await ytsr(currentChannel);
  const items = data.items.filter((element) => element.type === "video");
  //   console.log(items);
  const currentItem = items[Math.floor(Math.random() * items.length)];
  //   console.log(currentItem.link);
  return { link: currentItem.link, duration: currentItem.duration };
  //   return url;
};

const downloadVideo = async (url) => {
  const stream = await ytdl(url);
  return stream;
};

const getNewVideo = async () => {
  const videoData = await getVideoUrl();
  console.info(videoData);
  const stream = await downloadVideo(videoData.link);
  const videoStream = fs.createWriteStream("test-video.mp4");
  //   const videoResults = [];

  stream.pipe(videoStream);
  return new Promise((resolve) => videoStream.on("finish", resolve(videoData)));
  // return Promise.all([videoData, promise]);
};

// let main = async () => {
//   console.log(await getNewVideo());
// };
// main();

module.exports = { getNewVideo };
