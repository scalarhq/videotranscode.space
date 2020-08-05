import ComponentStore from '../store/componentStore';

import features from '../features/features';

import { updateData } from './hardware';

import { ffmpegReader, loadFFmpeg, ffmpegGarbageCollector } from './ffmpeg';

import loadFiles from './file';

const { CluiStore, VideoStore, FileStore, updateProcessedState } = ComponentStore;

const { defaultBlobType, updateCurrentFile, oldFiles } = FileStore;

const { updateBlobUrl, blobType } = VideoStore;

const createVideoObject = (processedFile: Uint8Array) => {
  const blobUrl = URL.createObjectURL(
    new Blob([processedFile.buffer], { type: blobType || defaultBlobType })
  );
  console.info(blobUrl);
  return blobUrl;
};

const onSubmitHandler = async () => {
  const start = new Date().getTime();
  const { configuration, chosenFeatures } = CluiStore;
  const loadedFiles = await loadFiles();

  // Currently Supports only Single Uploaded File, plan to support more in the future
  let currentFileName = loadedFiles[0];
  updateCurrentFile(currentFileName);
  console.group('Feature Execution');
  for (const key of chosenFeatures) {
    const CurrentFeature = features[key].feature;
    // @ts-ignore Fix with @lunaroyster later
    const featureObject = new CurrentFeature(configuration);
    console.log(featureObject);

    featureObject.setProgress();
    featureObject.updateProgress();
    // Expectation is each feature to run in blocking
    // eslint-disable-next-line no-await-in-loop
    currentFileName = await featureObject.runFFmpeg();
  }
  console.groupEnd();
  const processedFile = await ffmpegReader(currentFileName);
  const blobUrl = createVideoObject(processedFile);
  updateBlobUrl(blobUrl);
  await ffmpegGarbageCollector([...oldFiles, currentFileName]);
  updateProcessedState(true);
  const end = new Date().getTime();
  const encodeTime = (end - start) / 1000;
  updateData(encodeTime);
  console.log(`The processing is complete! Enjoy your video. It took ${encodeTime} seconds`);
};

export default onSubmitHandler;
export { loadFFmpeg };
