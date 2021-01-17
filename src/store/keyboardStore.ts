import { observable } from 'mobx'

class KeyboardStore {
  @observable toggleModal: (() => void) | null = null

  @observable showShortcuts: (() => void) | null = null
}

export default new KeyboardStore()
