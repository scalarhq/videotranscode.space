import ComponentStore from '../store/componentStore';

import features, { FeatureElement } from '../features/features';

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
  const { configuration, chosenFeatures } = CluiStore;
  const loadedFiles = await loadFiles();

  // Currently Supports only Single Uploaded File, plan to support more in the future
  let currentFileName = loadedFiles[0];
  updateCurrentFile(currentFileName);
  for (const key of chosenFeatures) {
    console.log('Executing Current Feature', key);
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
  console.log('Outside for loop');
  const processedFile = await ffmpegReader(currentFileName);
  const blobUrl = createVideoObject(processedFile);
  updateBlobUrl(blobUrl);
  await ffmpegGarbageCollector([...oldFiles, currentFileName]);
  updateProcessedState(true);
};

export default onSubmitHandler;
export { loadFFmpeg };
