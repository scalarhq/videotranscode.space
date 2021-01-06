import ComponentStore from '../store/componentStore'
import { FileNameTypes, FileTypes } from '../types/fileTypes'

const { blobType } = ComponentStore.VideoStore

export const createVideoObject = (processedFile: Uint8Array) => {
  const blobUrl = URL.createObjectURL(
    new Blob([processedFile.buffer], {
      type: blobType || ComponentStore.FileStore.defaultBlobType
    })
  )

  console.info(
    blobUrl,
    'Type',
    blobType || ComponentStore.FileStore.defaultBlobType
  )
  return blobUrl
}

export const setCurrentFile = (loadedFiles: FileNameTypes) => {
  if (loadedFiles.video && loadedFiles.video[0]) {
    return {
      name: loadedFiles.video[0].name,
      path: loadedFiles.video[0].path,
      type: 'video' as FileTypes
    }
  }
  if (loadedFiles.image && loadedFiles.image[0]) {
    return {
      name: loadedFiles.image[0].name,
      path: loadedFiles.image[0].path,
      type: 'image' as FileTypes
    }
  }
  if (loadedFiles.audio && loadedFiles.audio[0]) {
    return {
      name: loadedFiles.audio[0].name,
      path: loadedFiles.audio[0].path,
      type: 'audio' as FileTypes
    }
  }
  if (loadedFiles.other) {
    return {
      name: loadedFiles.other[0].name,
      path: loadedFiles.other[0].path,
      type: 'other' as FileTypes
    }
  }
  throw new Error('Could not find valid file')
}
