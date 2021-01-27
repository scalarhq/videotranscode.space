/**
 * Store to function as a utility store to get computed values
 */

import { ProgressProps } from '@components/progress/progress'
import { VideoProps } from '@components/video/video'
import { computed, observable } from 'mobx'

import ComponentStore from './componentStore'

type ProcessingState = 'selection' | 'processing' | 'done'
type SectionProps = VideoProps | ProgressProps | null

class UtilStore {
  @observable ComponentStore = ComponentStore

  @computed get processingState(): ProcessingState {
    const { processed, CluiStore } = this.ComponentStore

    const { isSubmitted } = CluiStore

    if (!isSubmitted) {
      return 'selection'
    } else if (!processed) {
      return 'processing'
    } else {
      return 'done'
    }
  }

  @computed get sectionProps(): SectionProps {
    const processingState = this.processingState

    const { ProgressStore, FileStore, VideoStore } = this.ComponentStore

    const { currentFileExtension } = FileStore

    const { toDisplay, url } = VideoStore

    if (processingState === 'selection') {
      return null
    } else if (processingState === 'processing') {
      return { ...ProgressStore }
    } else {
      return { url, toDisplay, ext: currentFileExtension }
    }
  }
}

const utilStore = new UtilStore()

if (process.browser) {
  // @ts-ignore
  // eslint-disable-next-line no-undef,  no-multi-assign
  window.util = utilStore
}

export default utilStore
