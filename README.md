# [Video Transcoder and Converter](https://videotranscode.space/)

![Logo](./documentation/logo.png)

[![Netlify Status](https://api.netlify.com/api/v1/badges/4b6c9412-f596-4f31-82a3-25e276a37c31/deploy-status)](https://app.netlify.com/sites/react-clui/deploys)
![Codecs And Formats CI](https://github.com/Mozilla-Open-Lab-Etwas/Video-Transcoder/workflows/Codecs%20And%20Formats%20CI/badge.svg)
![CodeQL](https://github.com/Etwas-Builders/Video-Transcoder/workflows/CodeQL/badge.svg)

[![Rahul Tarak](https://img.shields.io/badge/Author-Rahul%20Tarak-green)](https://cryogenicplanet.tech/)

[![Rithvik Mahindra](https://img.shields.io/badge/Contributor-Rithvik%20Mahindra-green)](https://www.linkedin.com/in/rithvik-mahindra/)
[![Zack Radisic](https://img.shields.io/badge/Contributor-Zack%20Radisic-green)](https://github.com/zackradisic)
[![Arnav Bansal](https://img.shields.io/badge/Contributor-Arnav%20Bansal-green)](https://github.com/lunaroyster)

A video transcoder and converter built using Web Assembly and FFMPEG to transcode and convert videos right in your browser while protecting your privacy.

**This project is in alpha stage of development**

## [Contributing](https://docs.videotranscode.space/pages/get%20started/contributingguidelines)

See [Quick Start](https://docs.videotranscode.space/pages/get%20started/quickstart) to learn how to get the project setup and working.

Our [Contributing Guidelines](https://docs.videotranscode.space/pages/get%20started/contributingguidelines) also should be a good starting point.

## [Documentation](https://docs.videotranscode.space/)

Full documentation is at https://docs.videotranscode.space/

The API Reference is [here](https://docs.videotranscode.space/globals.html)

## [Project Structure](https://docs.videotranscode.space/pages/get%20started/projectstructure)

## Browser Support

Our build of FFmpeg needs SharedArrayBuffer support so our browser support depends on that

<picture>
	<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/sharedarraybuffer.webp">
	<source type="image/png" srcset="https://caniuse.bitsofco.de/image/sharedarraybuffer.png">
	<img src="https://caniuse.bitsofco.de/image/sharedarraybuffer.jpg" alt="Data on support for the sharedarraybuffer feature across the major browsers from caniuse.com">
</picture>

Learn more https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility or https://caniuse.com/#feat=sharedarraybuffer
