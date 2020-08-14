import FileStore from '../store/fileStore';

import { ffmpegWriter } from './ffmpeg';

const { files } = FileStore;

/**
 * Loads Originally Uploaded Files into FFmpeg Memory
 */
const loadFiles = () => {
  const uploadFiles: Array<Promise<string>> = [];
  console.info(JSON.stringify(files));
  for (const file of files.values) {
    uploadFiles.push(ffmpegWriter(file));
  }
  return Promise.all(uploadFiles);
};

export default loadFiles;
