import { ffmpegWriter } from './ffmpeg';

import { FileTypes } from '../types/fileTypes';

import FileStore from '../store/fileStore';

/**
 * Loads Originally Uploaded Files into FFmpeg Memory
 */
const loadFiles = async () => {
  const { files } = FileStore;
  const uploadFiles: { [name in FileTypes]: Array<Promise<string>> } = {
    audio: [],
    video: [],
    image: [],
    other: [],
  };

  for (const type of ['audio', 'video', 'image']) {
    const currentFileList = files[type as FileTypes];
    if (currentFileList) {
      console.info('Chosen files', currentFileList);
      for (const fileObj of currentFileList) {
        uploadFiles[type as FileTypes].push(ffmpegWriter(fileObj.file));
      }
    }
  }
  return {
    video: await Promise.all(uploadFiles.video),
    audio: await Promise.all(uploadFiles.audio),
    image: await Promise.all(uploadFiles.image),
    other: await Promise.all(uploadFiles.other),
  };
};

// const handleFirstFileLoad = async (fileConfig: FileConfigType, files: InputFilesType) => {
//   // @ts-ignore
//   console.info('File Config', fileConfig, files.video[0].name);
//   const loadedFiles = await loadFiles(fileConfig, files);
//   console.info('Loaded files: ', loadedFiles);
//   const { primaryType } = fileConfig;
//   const primaryFiles = loadedFiles[primaryType as FileTypes];
//   console.info('Primary files: ', primaryFiles);
//   if (primaryFiles.length > 0) {
//     return { name: primaryFiles[0], type: primaryType as FileTypes };
//   }
//   throw new Error(
//     `Primary File Type of Feature did not have any files,
//     this is not the your fault as the user.Please report this by using the link below.`
//   );
// };

export default loadFiles;
