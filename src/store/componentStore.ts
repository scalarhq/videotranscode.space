/* eslint-disable import/extensions */
import { observable, action } from 'mobx';

import AbstractStore from './store';

// Stores
import CluiStore from './cluiStore';
import TerminalStore from './terminalStore';
import ProgressStore from './progressStore';
import VideoStore from './videoStore';
import FileStore from './fileStore';
import HardwareStore from './hardwareStore';

class ComponentStore extends AbstractStore {
  // Observables

  @observable transcoded: string = '';

  @observable processed: boolean = false;

  @observable isLoadingError = false;

  @observable loadingErrorObj: Error = new Error();

  @observable loaded = false;

  @observable landing = true;

  constructor() {
    super();
    this.init();
  }

  // Init

  @action init = () => {
    this.transcoded = '';
    this.processed = false;
    this.isLoadingError = false;
    this.loadingErrorObj = new Error();
    this.loaded = false;
  };

  @action reset = () => {
    this.CluiStore.reset();
    this.terminalStore.reset();
    this.FileStore.reset();
    this.ProgressStore.reset();
    this.VideoStore.reset();
    this.FileStore.reset();
    this.HardwareStore.reset();
    if (this.isLoadingError) {
      window.location.reload();
    }
    const originalLoadedState = this.loaded;
    this.init();
    this.loaded = originalLoadedState;
  };

  // Stores

  @observable CluiStore = CluiStore;

  @observable terminalStore = TerminalStore;

  @observable ProgressStore = ProgressStore;

  @observable VideoStore = VideoStore;

  @observable FileStore = FileStore;

  @observable HardwareStore = HardwareStore;

  // Actions

  @action
  updateProcessedState = (newState: boolean) => {
    this.processed = newState;
  };

  @action('Update Loaded')
  updateLoaded = (value: boolean) => {
    this.loaded = value;
  };

  @action('Update Load Error')
  updateLoadError = (state: boolean, err: Error) => {
    this.isLoadingError = state;
    this.loadingErrorObj = err;
  };

  @action('Update Landing')
  updateLanding = (state: boolean) => {
    this.landing = state;
  };
}
// @ts-ignore
// eslint-disable-next-line no-undef,  no-multi-assign
const store = (window.store = new ComponentStore());

export default store;
