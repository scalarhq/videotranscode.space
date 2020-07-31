/* eslint-disable import/extensions */
import { observable, action, computed } from 'mobx';

import { HardwareDataType } from '../types/hardwareData';
import formats from '../dist/formats';

// Stores
import CluiStore from './cluiStore';
import TerminalStore from './terminalStore';
import ProgressStore from './progressStore';
import VideoStore from './videoStore';

class ComponentStore {
  @observable CluiStore = CluiStore;

  @observable terminalStore = new TerminalStore();

  @observable ProgressStore = new ProgressStore();

  @observable VideoStore = new VideoStore();

  @observable hardwareData: HardwareDataType | null = null;

  @observable transcoded = '';

  @observable processed = false;

  @action
  updateProcessedState = (newState: boolean) => {
    this.processed = newState;
  };

  @observable currentFileName: string = '';

  @action
  updateCurrentFile = (fileName: string) => {
    this.currentFileName = fileName;
  };

  @observable loaded = false;

  @action('Update Loaded')
  updateLoaded = (value: boolean) => {
    this.loaded = value;
  };

  @observable files: { uploaded: boolean; values: File[] } = { uploaded: false, values: [] };

  renameFile = (originalFile: File, count: number, extension: string) =>
    new File([originalFile], `input-${count}.${extension}`, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });

  @action('Update Files')
  updateFiles = (value: File[]) => {
    if (value.length > 0) {
      const renamedFiles: File[] = [];
      let count = 0;
      for (const file of value) {
        const { name, size } = file;
        if (this.terminalStore && this.terminalStore.updateTerminalText) {
          this.terminalStore.updateTerminalText(`Received File ${name}`);
        }
        const nameComponents = name.split('.');
        const ext = nameComponents[nameComponents.length - 1];
        renamedFiles.push(this.renameFile(file, count, ext));
        count += 1;
      }
      Object.assign(this.files, { uploaded: true, values: renamedFiles });
      console.log(renamedFiles, JSON.stringify(this.files));
      if (this.terminalStore && this.terminalStore.updateTerminalText) {
        this.terminalStore.updateTerminalText(
          'This is a CLUI, a Command Line Graphical Interface, it will help you choose you settings.',
          true
        );
      }
    }
  };

  /**
   * Returns current file extension **without the dot**
   * Example mov, mp4
   */
  @computed get currentFileExtension() {
    const { currentFileName } = this;
    const nameArray = currentFileName.split('.');
    const ext = nameArray[nameArray.length - 1];
    return ext;
  }

  /**
   * Returns a computed string for blobType which takes the value of the current file extension
   * and return `video/$ext`. An example would be for an test.mov file it returns `video/mov`
   */
  @computed get defaultBlobType() {
    const ext = this.currentFileExtension;
    const blobType = `video/${ext}`;
    return blobType;
  }

  /**
   * Returns if the current file extension is displayable or not,
   * i.e, can the browser video tag support this extension
   */
  @computed get isDisplayable() {
    const ext = `.${this.currentFileExtension}`;

    for (const key of Object.keys(formats)) {
      const currentFormat = formats[key];
      if (currentFormat.extension === ext) {
        return currentFormat.display;
      }
    }
    return false;
  }
}
// @ts-ignore
// eslint-disable-next-line no-undef,  no-multi-assign
const store = (window.store = new ComponentStore());

export default store;
