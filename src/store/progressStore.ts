import { action, observable } from 'mobx'

import AbstractStore from './store'

class ProgressStore extends AbstractStore {
  // Observables

  @observable progress = 1

  @observable color = ''

  @observable name = ''

  // Speed scale factor
  @observable multipler = 1

  // Constructor
  constructor() {
    super()
    this.init()
  }

  // Init
  @action init = () => {
    this.progress = 1
    this.color = ''
    this.name = ''
  }

  @action
  updateStatic = (newName: string, newColor: string, multipler = 1) => {
    this.name = newName
    this.color = newColor
    this.multipler = multipler
  }

  @action
  updateProgress = (value: number) => {
    this.progress = value
  }
}

export default new ProgressStore()
