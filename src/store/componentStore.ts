/* eslint-disable import/extensions */
import { observable, action } from 'mobx';

import CluiStore from './cluiStore';

import TerminalStore from './terminalStore';

// import { FORMAT_TYPES, CODEC_TYPES, ConfigOptions } from './configuration';
import { HardwareDataType } from '../types/hardwareData';
import ProgressStore from './progressStore';
import VideoStore from './videoStore';
// import { ComponentStoreType } from "../types/store"

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
}
// @ts-ignore
// eslint-disable-next-line no-undef,  no-multi-assign
const store = (window.store = new ComponentStore());

export default store;
