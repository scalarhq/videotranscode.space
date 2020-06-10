// Unit Testing for Newly Added Codecs
const fs = require("fs");
const path = require("path");
const { createFFmpeg } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({ log: true });

const codecs = require("../Codec-Formats/codecs").CODEC_TYPES;
const formats = require("../Codec-Formats/formats")(codecs);

//console.log(JSON.stringify(formats));

const formatsList = Object.keys(formats).map((key) => {
  const object = formats[key];
  object.type = key;
  return object;
});

describe("Automated Format and Codec Testing", () => {
  beforeAll(async () => {
    await ffmpeg.load();
    await ffmpeg.write(
      "input.mp4",
      path.join(__dirname, "inputFiles", "input.mp4")
    );
  });
  formatsList.forEach(({ type, name, extension, defaultCodec, codecs }) => {
    describe(`Testing Format ${type}`, () => {
      codecs.forEach((codec) => {
        it(`Testing Codec ${codec.name} with format ${type}`, async () => {
          expect(codec).toBeDefined();
          expect(codec.ffmpegLib).toBeDefined();
          expect(extension).toBeDefined();
          expect(type).toBeDefined();
          const output = `output${extension}`;
          try {
            await ffmpeg.run(` -i input.mp4 -c:v ${codec.ffmpegLib} ${output}`);
          } catch (err) {
            console.error(err);
            throw new Error("Unable to run ffmpeg", err.message);
          }
          console.log(` -i input.mp4 -c:v ${codec.ffmpegLib} ${output}`);
          const data = ffmpeg.read(output);
          ffmpeg.remove(output);
          expect(data.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
