# Contributing a feature

This a very straightforward process and **requires zero code.**

1. Create a .yml file in `formats/src` with the name of your format, **name of your file will be its key**
2. Add the required information below in your .yml file

```yml
# User Facing Name of your Format
name: 'AVI'

# File Extension
extension: '.avi'

# Blob Type, if unsure just make it video/extension
type: 'video/avi'

# If the browser can display this format in a video element
display: false

# Optional Field,
# If your format requires some codec and
# cannot default please add a codec here
defaultCodec: H264

# List of supported codecs
codecs:
  - H264
  - MPEG4
```

You might need to add additional codecs for your format, to learn more about adding codecs see {@page Codecs}

3. Submit Pull Request! Please include the link to the formats ffmpeg docs
