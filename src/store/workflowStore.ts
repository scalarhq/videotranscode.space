import { Features } from '@features/features'
import { action, observable } from 'mobx'
import toast from 'react-hot-toast'

import Store from './store'

type setWorkflow = ((workflow: string[]) => string[]) | string[]

class WorkflowStore extends Store {
  constructor() {
    super()
    this.init()
  }

  @action init = () => {
    this.workflow = []
    this.currentFeature = ''
    this.modalState = false
    this.editFeature = null
  }

  @observable workflow: string[] = []
  @observable currentFeature = ''
  @observable modalState = false

  @observable editFeature: keyof Features | null = null

  @action updateWorkflow = (newKey: string) => {
    toast.success('Added new feature')

    this.workflow.push(newKey)
  }

  @action setWorkflow = (input: setWorkflow) => {
    if (typeof input === 'function') {
      this.workflow = input(this.workflow)
    } else {
      this.workflow = input
    }
  }

  @action updateCurrentFeature = (feature: string) => {
    this.currentFeature = feature
  }

  @action updateModalState = (state: boolean) => {
    this.editFeature = null
    this.modalState = state
  }

  @action setModalState = (input: ((state: boolean) => boolean) | boolean) => {
    if (typeof input === 'boolean') {
      this.modalState = input
    } else {
      this.modalState = input(this.modalState)
    }
  }

  @action updateEditFeature = (featureKey: keyof Features) => {
    this.editFeature = featureKey
    this.modalState = true
  }
}

export default new WorkflowStore()
