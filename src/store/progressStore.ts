import { action, observable } from 'mobx'

import AbstractStore from './store'

class ProgressStore extends AbstractStore {
  // Observables

  @observable progress: number = 1

  @observable color: string = ''

  @observable name: string = ''

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
  updateStatic = (newName: string, newColor: string) => {
    this.name = newName
    this.color = newColor
  }

  @action
  updateProgress = (value: number) => {
    this.progress = value
  }
}

export default new ProgressStore()
