// Unit Testing for Newly Added Codecs
const fs = require("fs");
const path = require("path");
const { createFFmpeg } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({ log: true });

const codecs = require("codecs");
const formats = require("formats");

const formatsList = Object.keys(formats).map((key) => {
  const object = formats[key];
  object.type = key;
  return object;
});

describe("Automated Format and Codec Testing", () => {
  beforeAll(async () => {
    await ffmpeg.load();
    await ffmpeg.write("input.mp4", path(__dirname) + "./inputFiles/input.mp4");
  });
  formatsList.forEach(({ type, name, extension, defaultCodec, codecs }) => {
    describe(`Testing Format ${type}`, () => {
      codecs.forEach((codec) => {
        it(`Testing Codec ${codec.name} with format ${format.type}`, async () => {
          const output = `output-${format.type}-${codec.ffmpegLibs}${format.extension}`;
          await ffmpeg.run(` -i input.mp4 -c:v ${codec.ffmpegLibs} ${output}`);
          const data = ffmpeg.read(output);
          ffmpeg.remove(output);
          expect(data.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
