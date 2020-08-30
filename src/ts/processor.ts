import ComponentStore from '../store/componentStore';

import features from '../features/features';

import { updateData } from './hardware';

import { CustomFileType, FileNameTypes, FileTypes } from '../types/fileTypes';

import { ffmpegReader, loadFFmpeg, ffmpegGarbageCollector } from './ffmpeg';

import loadFiles from './file';

const { CluiStore, VideoStore, FileStore, updateProcessedState, terminalStore } = ComponentStore;

const { updateCurrentFile, oldFiles } = FileStore;

const { updateBlobUrl, blobType } = VideoStore;

const { clearTerminal } = terminalStore;

const createVideoObject = (processedFile: Uint8Array) => {
  const blobUrl = URL.createObjectURL(
    new Blob([processedFile.buffer], { type: blobType || ComponentStore.FileStore.defaultBlobType })
  );
  console.info(blobUrl, 'Type', blobType || ComponentStore.FileStore.defaultBlobType);
  return blobUrl;
};

const setCurrentFile = (loadedFiles: FileNameTypes) => {
  if (loadedFiles.video && loadedFiles.video[0]) {
    return { name: loadedFiles.video[0], type: 'video' as FileTypes };
  }
  if (loadedFiles.image && loadedFiles.image[0]) {
    return { name: loadedFiles.image[0], type: 'image' as FileTypes };
  }
  if (loadedFiles.audio && loadedFiles.audio[0]) {
    return { name: loadedFiles.audio[0], type: 'audio' as FileTypes };
  }
  if (loadedFiles.other) {
    return { name: loadedFiles.other[0], type: 'other' as FileTypes };
  }
  throw new Error('Could not find valid file');
};

const onSubmitHandler = async () => {
  const start = new Date().getTime();
  const { configuration, chosenFeatures } = CluiStore;
  const loadedFiles = await loadFiles();

  let currentFile: CustomFileType = setCurrentFile(loadedFiles);
  updateCurrentFile(currentFile);

  for (const key of chosenFeatures) {
    const CurrentFeature = features[key].feature;
    // @ts-ignore Fix with @lunaroyster later
    const featureObject = new CurrentFeature(configuration);
    const { primaryType } = featureObject.fileConfig;
    console.info('Primary Type', primaryType);
    if (primaryType !== 'video') {
      currentFile = {
        name: loadedFiles[primaryType as FileTypes][0],
        type: primaryType as FileTypes,
      };
      console.info('New Current File', currentFile);
      updateCurrentFile(currentFile);
    }
    if (currentFile) {
      featureObject.setProgress();
      featureObject.updateProgress();
      // Expectation is each feature to run in blocking
      // eslint-disable-next-line no-await-in-loop
      currentFile = await featureObject.runFFmpeg();
    }
  }
  const processedFile = await ffmpegReader(currentFile.name);
  const blobUrl = createVideoObject(processedFile);
  updateBlobUrl(blobUrl);
  try {
    await ffmpegGarbageCollector([...oldFiles, currentFile.name]);
  } catch (err) {
    console.info('Unable to garbage collect', err);
  }
  updateProcessedState(true);
  const end = new Date().getTime();
  const encodeTime = (end - start) / 1000;
  updateData(encodeTime);
  clearTerminal();
  console.log(`The processing is complete! Enjoy your video. It took ${encodeTime} seconds`);
};

export default onSubmitHandler;
export { loadFFmpeg };
