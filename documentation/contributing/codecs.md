# Contributing a Codec

This is one of the most straightforward process, **which requires zero code to do**

**Make sure ffmpeg supports your codec and find the ffmpeg cli command for the codec**

1. Create a .yml file in `codecs/src` with the name of your codec, **the name of your file will be its key**
2. Add the required information below into your .yml file

```yml
# User facing name of your Codec
name: H.264

#  FFmpeg Compression Ranges
compressionRange:
  min: 1
  max: 51

# FFmpeg CLI codec type,
# Just google ffmpeg command for the codec and find this
ffmpegLib: libx264
```

3. Update the configuration of each format that supports this codecs, see more about format files at {@page Formats}

```yml
# Rest of Format File
codecs:
  # Add your codec's file name here in FULL CAPS with no - or .
  - H264
  - MPEG4
```

4. Submit Pull Request! Please include the ffmpeg command and format link from the ffmpeg docs.
