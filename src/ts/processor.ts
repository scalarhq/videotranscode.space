import ComponentStore from '../store/componentStore';

import features from '../features/features';

import { updateData } from './hardware';

import { CustomFileType } from '../types/fileTypes';

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

const onSubmitHandler = async () => {
  const start = new Date().getTime();
  const { configuration, chosenFeatures } = CluiStore;
  const loadedFiles = await loadFiles();
  let currentFile: CustomFileType = { name: loadedFiles.video[0], type: 'video' };
  updateCurrentFile(currentFile);

  for (const key of chosenFeatures) {
    const CurrentFeature = features[key].feature;
    // @ts-ignore Fix with @lunaroyster later
    const featureObject = new CurrentFeature(configuration);
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
  await ffmpegGarbageCollector([...oldFiles, currentFile.name]);
  updateProcessedState(true);
  const end = new Date().getTime();
  const encodeTime = (end - start) / 1000;
  updateData(encodeTime);
  clearTerminal();
  console.log(`The processing is complete! Enjoy your video. It took ${encodeTime} seconds`);
};

export default onSubmitHandler;
export { loadFFmpeg };
