const codecs = require("../codecs/codecs.js");

describe("Validate Codec Test", () => {
  it("IS Defined", () => {
    expect(codecs.validateCodec).toBeDefined();
    expect(typeof codecs.validateCodec).toBe("function");
  });

  it("Valid Codec Test", () => {
    const codec = {
      name: "H.264",
      compressionRange: {
        min: 1,
        max: 51,
      },
      ffmpegLib: "libx264",
    };
    let err = codecs.validateCodec("H264", codec);
    expect(err).toBeFalsy;
  });

  it("Duplicate Codec Test", () => {
    const codec = {
      name: "H.264",
      compressionRange: {
        min: 1,
        max: 51,
      },
      ffmpegLib: "libx264",
    };
    let err = codecs.validateCodec("H264", codec);
    expect(err).toBeTruthy;
    expect(err.message.includes("Codec Type for")).toBeTruthy;
  });

  it("No max compression level", () => {
    const codec = {
      name: "noMax",
      compressionRange: {
        min: 1,
      },
      ffmpegLib: "noMax",
    };
    let err = codecs.validateCodec("H264", codec);
    expect(err).toBeTruthy;
  });

  it("No min compression level", () => {
    const codec = {
      name: "noMin",
      compressionRange: {
        max: 10,
      },
      ffmpegLib: "noMin",
    };
    let err = codecs.validateCodec("H264", codec);
    expect(err).toBeTruthy;
  });

  it("Max smaller than min compression level", () => {
    const codec = {
      name: "minLargerThanMax",
      compressionRange: {
        max: 10,
        min: 100,
      },
      ffmpegLib: "minLargerThanMax",
    };
    let err = codecs.validateCodec("H264", codec);
    expect(err).toBeTruthy;
  });

  it("FFmpegLib not Defined", () => {
    const codec = {
      name: "noLib",
      compressionRange: {
        max: 10,
        min: 100,
      },
    };
    let err = codecs.validateCodec("noLib", codec);
    expect(err).toBeTruthy;
  });

  it("Name Not Defined", () => {
    const codec = {
      compressionRange: {
        max: 10,
        min: 100,
      },
      ffmpegLib: "noName",
    };
    let err = codecs.validateCodec("noName", codec);
    expect(err).toBeTruthy;
  });
});

describe("Initialization Function", () => {
  beforeAll(() => {
    codecs.deleteCodecTypes();
  });
  it("IS Defined", () => {
    expect(codecs.init).toBeDefined;
    expect(typeof codecs.init).toBe("function");
  });

  it("Build without errors", () => {
    try {
      codecs.init();
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });
});
