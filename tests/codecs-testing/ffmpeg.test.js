// Unit Testing for Newly Added Codecs
const fs = require("fs");
const cluster = require("cluster");
const path = require("path");
const { createFFmpeg } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({ log: false });

const codecs = require("../codecs/codecs.js");
const formats = require("../formats/formats.js");

let count = 0;

const formatsList = Object.keys(formats).map((key) => {
  const object = formats[key];
  object.type = key;
  return object;
});

let loadFFmpeg = async () => {
  await ffmpeg.load();
  await ffmpeg.write(
    "input.mp4",
    path.join(__dirname, "inputFiles", "input.mp4")
  );
};

describe("FFmpeg Testing", () => {
  beforeAll(async () => {
    await loadFFmpeg();
  });
  afterAll(() => {
    for (let workerId in cluster.workers) {
      cluster.workers[workerId].kill();
    }
  });
  describe("Automated Format and Codec Testing", () => {
    formatsList.forEach(({ type, name, extension, defaultCodec, codecs }) => {
      // console.info(formatsList);
      describe(`Testing Format ${type}`, () => {
        // console.info(codecs);
        it("Has Codecs", () => {
          expect(codecs).toBeDefined();
        });
        codecs.forEach((codec) => {
          describe("Transcode Testing", () => {
            if (!codec.notSupported) {
              it(`Testing Codec ${codec.name} with format ${type}`, async () => {
                expect(codec).toBeDefined();
                expect(codec.ffmpegLib).toBeDefined();
                expect(extension).toBeDefined();
                expect(type).toBeDefined();
                const output = `output${extension}`;
                try {
                  await ffmpeg.run(
                    ` -i input.mp4 -c:v ${codec.ffmpegLib} ${output}`
                  );
                } catch (err) {
                  console.error(err);
                  throw new Error("Unable to run ffmpeg", err.message);
                }
                const data = ffmpeg.read(output);
                ffmpeg.remove(output);
                expect(data.length).toBeGreaterThan(0);
              });
            } else {
              it.skip(`Testing for Codec ${codec.name} was skipped as it is not supported at this time`, () => {
                expect(codec).toBeDefined();
                expect(codec.ffmpegLib).toBeDefined();
                expect(extension).toBeDefined();
                expect(type).toBeDefined();
                expect(codec.notSupported).toBeTruthy();
              });
            }
          });
          describe("Compression Testing", () => {
            if (!codec.notSupported) {
              it(`Testing Compression on ${codec.name} with format ${type}`, async () => {
                expect(codec).toBeDefined();
                expect(codec.ffmpegLib).toBeDefined();
                expect(extension).toBeDefined();
                expect(type).toBeDefined();
                const { min, max } = codec.compressionRange;
                const compression = `-crf ${
                  Math.floor(Math.random() * (max - min)) + min
                }`;
                console.info("Compression", compression);
                const output = `output${extension}`;
                try {
                  await ffmpeg.run(
                    ` -i input.mp4 -c:v ${codec.ffmpegLib} ${compression} ${output}`
                  );
                } catch (err) {
                  console.error(err);
                  throw new Error("Unable to run ffmpeg", err.message);
                }
                const data = ffmpeg.read(output);
                ffmpeg.remove(output);
                expect(data.length).toBeGreaterThan(0);
              });
            } else {
              it.skip(`Testing Compression for Codec ${codec.name} was skipped as it is not supported at this time`, () => {
                expect(codec).toBeDefined();
                expect(codec.ffmpegLib).toBeDefined();
                expect(extension).toBeDefined();
                expect(type).toBeDefined();
                expect(codec.notSupported).toBeTruthy();
              });
            }
          });
        });
      });
    });
  });
});
