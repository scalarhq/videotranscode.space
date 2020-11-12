import { observable, action } from 'mobx'
import AbstractStore from './store'

class VideoStore extends AbstractStore {
  // Observables
  @observable url: string = ''

  @observable blobType: string = ''

  @observable toDisplay: boolean = false

  constructor() {
    super()
    this.init()
  }

  @action init = () => {
    this.url = ''
    this.blobType = ''
    this.toDisplay = false
  }

  @action
  updateBlobUrl = (newUrl: string) => {
    this.url = newUrl
  }

  @action
  updateVideoDisplay = (value: boolean) => {
    this.toDisplay = value
  }

  @action
  updateBlobType = (value: string) => {
    this.blobType = value
  }
}

export default new VideoStore()
