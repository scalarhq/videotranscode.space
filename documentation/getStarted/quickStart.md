# Guide for Running Wasm Video Transcoder

This file will just take you through how to install, build and run this project

1. [Install Wasm Video Transcoder](#install-wasm-video-transcoder)
2. [Build Wasm Video Transcoder](#build-wasm-video-transcoder)
3. [Running Wasm Video Transcoder](#running-wasm-video-transcoder)

## Install Wasm Video Transcoder

Clone the repository or fork it then clone the forked repository

```bash
git clone https://github.com/Mozilla-Open-Lab-Etwas/Video-Transcoder.git
yarn install
# or
npm install
```

**We use yarn, you are free to use npm but please do not commit your package-lock.json file**

## Build Wasm Video Transcoder

This project has a build step even before running the development server.

The below command generates the build time files for formats, codecs and workflows, **the project will not load without this step.**

```bash
yarn generate
# or
npm run-scripts generate
```

## Running Wasm Video Transcoder

```bash
yarn start
# or
npm start
```

**Currently the project only supports Chromium, so please use a chromium browser (Chrome, Edge, Safari)**
