/* eslint-disable import/extensions */
import { action, observable } from 'mobx'
import { createContext } from 'react'

// Stores
import CluiStore from './cluiStore'
import FileStore from './fileStore'
import HardwareStore from './hardwareStore'
import ProgressStore from './progressStore'
import AbstractStore from './store'
import TerminalStore from './terminalStore'
import UserStore from './userStore'
import VideoStore from './videoStore'
import WorkflowStore from './workflowStore'

class ComponentStore extends AbstractStore {
  // Observables

  @observable transcoded = ''

  @observable processed = false

  @observable isLoadingError = false

  @observable loadingErrorObj: Error = new Error()

  @observable loaded = false

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @observable startTour: () => void = () => {}

  @observable globalReset = false

  constructor() {
    super()
    this.init()
  }

  // Init

  @action init = () => {
    this.transcoded = ''
    this.processed = false
    this.isLoadingError = false
    this.loadingErrorObj = new Error()
    this.loaded = false
  }

  @action reset = () => {
    this.globalReset = true
    this.CluiStore.reset()
    this.terminalStore.reset()
    this.FileStore.reset()
    this.ProgressStore.reset()
    this.VideoStore.reset()
    this.FileStore.reset()
    this.HardwareStore.reset()
    if (this.isLoadingError) {
      window.location.reload()
    }
    const originalLoadedState = this.loaded
    this.init()
    this.loaded = originalLoadedState
    setTimeout(() => {
      this.globalReset = false
    }, 100)
  }

  // Stores

  @observable CluiStore = CluiStore

  @observable terminalStore = TerminalStore

  @observable ProgressStore = ProgressStore

  @observable VideoStore = VideoStore

  @observable FileStore = FileStore

  @observable HardwareStore = HardwareStore

  @observable UserStore = UserStore

  @observable WorkflowStore = WorkflowStore

  // Actions

  @action
  updateProcessedState = (newState: boolean) => {
    this.processed = newState
  }

  @action('Update Loaded')
  updateLoaded = (value: boolean) => {
    this.loaded = value
  }

  @action('Update Load Error')
  updateLoadError = (state: boolean, err: Error) => {
    this.isLoadingError = state
    this.loadingErrorObj = err
  }
}

const store = new ComponentStore()

if (process.browser) {
  // @ts-ignore
  // eslint-disable-next-line no-undef,  no-multi-assign
  window.store = store
}

export default store

export const ComponentStoreContext = createContext(store)
