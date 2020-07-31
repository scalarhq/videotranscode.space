/* eslint-disable import/extensions */
import { observable, action } from 'mobx';

import { HardwareDataType } from '../types/hardwareData';

// Stores
import CluiStore from './cluiStore';
import TerminalStore from './terminalStore';
import ProgressStore from './progressStore';
import VideoStore from './videoStore';
import FileStore from './fileStore';

class ComponentStore {
  @observable CluiStore = CluiStore;

  @observable terminalStore = TerminalStore;

  @observable ProgressStore = new ProgressStore();

  @observable VideoStore = new VideoStore();

  @observable FileStore = FileStore;

  @observable hardwareData: HardwareDataType | null = null;

  @observable transcoded = '';

  @observable processed = false;

  @action
  updateProcessedState = (newState: boolean) => {
    this.processed = newState;
  };

  @observable loaded = false;

  @action('Update Loaded')
  updateLoaded = (value: boolean) => {
    this.loaded = value;
  };
}
// @ts-ignore
// eslint-disable-next-line no-undef,  no-multi-assign
const store = (window.store = new ComponentStore());

export default store;
