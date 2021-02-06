import { action, computed, observable, toJS } from 'mobx'
import { RefObject } from 'react'

import {
  CustomFileType,
  FileNameTypes,
  FileTransformType,
  FileTypes,
  FileWithMetadata,
  InputFilesType
} from '~@types/fileTypes'

import formats from '../dist/formats'
import AbstractStore from './store'
import TerminalStore from './terminalStore'

class FileStore extends AbstractStore {
  // Stores
  @observable terminalStore = TerminalStore

  // Observables

  @observable oldFiles: Array<string> = []

  @observable currentFile: CustomFileType = {
    name: '',
    type: 'video',
    path: ''
  }

  @observable files: InputFilesType = {}

  /**
   * File object for electron, only contains metadata and cleans out the entire file
   *
   * When this object is defined the main file object this.files will be deleted
   */

  // String of names of files loaded to FFmpeg(WASM)
  @observable loadedFiles: FileNameTypes = {}

  @observable dropzoneRef: RefObject<HTMLDivElement> | undefined

  // Constructor

  constructor() {
    super()
    this.init()
  }

  // Init
  @action init = () => {
    this.oldFiles = []
    this.currentFile = { name: '', type: 'video', path: '' }
    this.files = {}
  }

  // Helper Functions

  /**
   *  Returns file extension for given file name
   * @param fileName as a string which is the file's name
   */
  getFileExtension = (fileName: string) => {
    const filePathArr = fileName.split('.')
    return filePathArr[filePathArr.length - 1]
  }

  /**
   * Returns a string that is file size which is human readable
   * @param inputSize file size as number of bytes
   */
  sizeHumanReadable = (inputSize: number) => {
    let fileSize = inputSize
    const fSExt = ['Bytes', 'KB', 'MB', 'GB']
    let i = 0
    while (fileSize > 900) {
      fileSize /= 1024
      i += 1
    }
    const exactSize = `${Math.round(fileSize * 100) / 100} ${fSExt[i]}`
    return exactSize
  }

  /**
   * Returns new File object with a new name
   * @param originalFile Original File Object
   * @param type File type, this is not the full file type but rather the category @link{FileTypes}
   * @param count Number of files in file category
   * @param extension File's extension
   */
  renameFile = (
    originalFile: FileWithMetadata,
    type: string,
    count: number,
    extension: string
  ): FileWithMetadata => {
    const { file } = originalFile
    console.info('File Ingestion original file', originalFile)
    const newFile = new File([file], `${type}-input-${count}.${extension}`, {
      type: file.type,
      lastModified: file.lastModified
    })

    return {
      file: newFile,
      uuid: originalFile.uuid,
      preview: originalFile.preview,
      customType: originalFile.customType,
      videoMetadata: originalFile.videoMetadata,
      path: originalFile.path
    }
  }

  // Computed

  /**
   * Returns current file extension **without the dot**
   * Example mov, mp4
   */
  @computed get currentFileExtension() {
    const { currentFile } = this
    console.info(currentFile)
    const nameArray = currentFile.name.split('.')
    const ext = nameArray[nameArray.length - 1]
    return ext
  }

  /**
   * Returns a computed string for blobType which takes the value of the current file extension
   * and return `video/$ext`. An example would be for an test.mov file it returns `video/mov`
   */
  @computed get defaultBlobType() {
    const { currentFileExtension } = this
    const blobType = `video/${currentFileExtension}`
    return blobType
  }

  /**
   * Returns if the current file extension is displayable or not,
   * i.e, can the browser video tag support this extension
   */
  @computed get isDisplayable() {
    const ext = `.${this.currentFileExtension}`

    console.info('Current file extension', ext)

    for (const key of Object.keys(formats)) {
      const currentFormat = formats[key]
      if (currentFormat.extension === ext) {
        return currentFormat.display
      }
    }
    return false
  }

  /**
   * Returns an array of all the files from all category
   *
   */
  @computed get allFiles() {
    const { files } = this
    let fileValues: FileWithMetadata[] = []
    if (files.audio) {
      fileValues = fileValues.concat(files.audio)
    }
    if (files.video) {
      fileValues = fileValues.concat(files.video)
    }
    if (files.image) {
      fileValues = fileValues.concat(files.image)
    }
    if (files.other) {
      fileValues = fileValues.concat(files.other)
    }
    return fileValues
  }

  @computed get fileData() {
    const { allFiles, getFileExtension, sizeHumanReadable } = this

    const fileData: Array<{ size: string; ext: string }> = allFiles.map(
      ({ file, videoMetadata }) => ({
        size: sizeHumanReadable(file.size),
        ext: getFileExtension(file.name),
        duration: videoMetadata?.duration || 'undefined'
      })
    )
    return fileData
  }

  @computed get fileReference() {
    return toJS(this.files)
  }

  // Actions

  @action('Update Current File')
  updateCurrentFile = (fileConfig: {
    name: string
    path: string
    type: FileTypes
  }) => {
    this.oldFiles.push(this.currentFile.name)
    this.currentFile = fileConfig
  }

  @action('Set dropzone ref')
  setDropzoneRef = (ref: RefObject<HTMLDivElement>) => {
    this.dropzoneRef = ref
  }

  @action('Open file drawer')
  openFileDrawer = () => {
    const { dropzoneRef } = this
    if (dropzoneRef && dropzoneRef.current) {
      dropzoneRef.current.click()
    }
  }

  /**
   * Operational Transform to change state of files
   * @param newTransform is a array of transformations of type @link{FileTransformType}
   * This transform handles three main types of transformations:
   * - Move file from position A to position B, while appropriately renaming the files
   * - Delete file at position A
   * - Insert file at end of array
   * Each transform represents only one file type and is executed for that type. @link{FileTypes}
   */
  @action('Update Files Operational Transform')
  updateFiles = (newTransform: FileTransformType[]) => {
    const { getFileExtension, renameFile } = this

    for (const transform of newTransform) {
      const { state, type } = transform
      const currentFileList = this.allFiles

      switch (state) {
        case 'Move': {
          if (currentFileList) {
            const { position, secondPosition } = transform

            if (position && secondPosition) {
              // Rename Files
              const newFileForPosition = renameFile(
                currentFileList[secondPosition],
                type,
                secondPosition,
                getFileExtension(currentFileList[secondPosition].file.name)
              )
              const newFileForSecondPosition = renameFile(
                currentFileList[position],
                type,
                position,
                getFileExtension(currentFileList[position].file.name)
              )
              // Insert Position
              currentFileList[position] = newFileForPosition
              currentFileList[secondPosition] = newFileForSecondPosition
            }
          }
          break
        }
        case 'Delete': {
          if (currentFileList) {
            const { position } = transform
            if (position) {
              currentFileList.splice(position, 1)
            }
          }
          break
        }
        case 'Insert': {
          const { fileObj } = transform

          if (fileObj) {
            const { file } = fileObj

            if (file) {
              const renamedFile = renameFile(
                fileObj,
                type,
                currentFileList?.length || 0,
                getFileExtension(file.name)
              )
              currentFileList.push(renamedFile)

              if (this.terminalStore && this.terminalStore.updateTerminalText) {
                this.terminalStore.updateTerminalText(
                  `Received File ${file.name}`
                )
              }
            }
          }
          break
        }
        default: {
          break
        }
      }
      this.files[type] = currentFileList
    }
  }

  @action('Update Loaded Files')
  updateLoadedFiles = (loadedFiles: FileNameTypes) => {
    this.loadedFiles = loadedFiles
  }
}

const fileStore = new FileStore()

export default fileStore
