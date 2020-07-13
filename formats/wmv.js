module.exports = (CODEC_TYPES) => ({
  name: "WMV",
  extension: ".wmv",
  type: "video/wmv",
  display: false,
  defaultCodec: CODEC_TYPES.WINDOWS,
  codecs: [CODEC_TYPES.WINDOWS],
});
