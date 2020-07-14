import { FileDataType } from '../types/hardwareData';
import { fileUploaded, showConfig } from '../store/stores';

let fileInput: File;
const fileData: FileDataType = {
  size: 0,
  ext: '',
};

const renameFile = (originalFile: File, extension: string) => {
  return new File([originalFile], `input.${extension}`, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

/** Triggers when a file is uploaded */
fileUploaded.subscribe((files: File[]) => {
  if (files.length > 0) {
    const file: File = files[0];
    const { name, size } = file;
    fileData.size = size;
    const nameComponents = name.split('.');
    fileData.ext = nameComponents[nameComponents.length - 1];
    console.log(`The file ${name} is ready to be processed, please choose your settings`);
    const renamedFile = renameFile(file, fileData.ext);
    fileInput = renamedFile;
    showConfig.update(() => true);
  }
});

export { fileInput, fileData };
