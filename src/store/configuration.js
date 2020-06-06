export const CODEC_TYPES = {
  H264: {
    name: "H.264",
    compressionRange: {
      min: 1,
      max: 51,
    },
    ffmpegLib: "libx264",
  },
  MPEG4: {
    name: "MPEG-4",
    compressionRange: {
      min: 1,
      max: 31,
    },
    ffmpegLib: "libxvid",
  },
  WINDOWS: {
    name: "Windows Media Video",
    compressionRange: {
      min: 1,
      max: 51,
    },
    ffmpegLib: "wmv2",
  },
};

export const FORMAT_TYPES = {
  MP4: {
    name: "MP4",
    extension: ".mp4",
    display: true,
    defaultCodec: null,
    type: "video/mp4",
    codecs: [CODEC_TYPES.H264, CODEC_TYPES.MPEG4],
  },
  AVI: {
    name: "AVI",
    extension: ".avi",
    display: false,
    defaultCodec: CODEC_TYPES.H264,
    codecs: [CODEC_TYPES.H264, CODEC_TYPES.MPEG4],
  },
  MOV: {
    name: "MOV",
    extension: ".mov",
    display: true,
    defaultCodec: CODEC_TYPES.H264,
    codecs: [CODEC_TYPES.H264, CODEC_TYPES.MPEG4],
  },
  WMV: {
    name: "WMV",
    extension: ".wmv",
    display: false,
    defaultCodec: CODEC_TYPES.WINDOWS,
    codecs: [CODEC_TYPES.WINDOWS],
  },
};

export const CONFIG_OPTION_TYPES = {
  FORMAT: "format",
  CODEC: "codec",
  COMPRESSION: "compression",
};

/**
 * Find a CODEC_TYPE or FORMAT_TYPE by its name
 *
 */
export const find = (type, name) => {
  let t = null;
  if (type === CONFIG_OPTION_TYPES.FORMAT) t = FORMAT_TYPES;
  if (type === CONFIG_OPTION_TYPES.CODEC) t = CODEC_TYPES;
  if (!t) return null;

  return Object.keys(t)
    .map((key) => t[key])
    .find((e) => e.name === name);
};

/**
 * Generate the FFmpeg flags for codec and compression level:

 *      getFFmpegFlags(FORMAT_TYPES.MP4, CODEC_TYPES.H264, 31)
 *          -> '-c:v libx264 -crf 31'
 * 
 *      getFFmpegFlags(FORMAT_TYPES.mp4, CODEC_TYPES.MPEG4, 31)
 *          -> '-c:v mpeg4 -qscale:v 31'
 */
export const getFFmpegFlags = (
  codecType = formatType.ffmpegLib,
  compressionLevel
) => {
  if (
    compressionLevel < codecType.compressionRange.min &&
    compressionLevel > codecType.compressionRange.max
  )
    throw new Error(
      `Compression level is not within codec range: ${CODEC_TYPES.name}`
    );
};
