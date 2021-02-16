import toast from 'react-hot-toast'
import addNotification from 'react-push-notification'

import features from '../features/features'
import ComponentStore from '../store/componentStore'
import { CustomFileType, FileNameTypes, FileTypes } from '../types/fileTypes'
import electron, { electronWrapper, isElectron } from './electron'
import { ffmpegGarbageCollector, ffmpegReader, loadFFmpeg } from './ffmpeg'
import loadFiles from './file'
import { updateData } from './hardware'
import { createVideoObject, setCurrentFile } from './helpers'
import { electronLoadFiles } from './utils/electronHelper'

const {
  CluiStore,
  VideoStore,
  FileStore,
  updateProcessedState,
  terminalStore,
  UserStore
} = ComponentStore

if (typeof window !== 'undefined' && 'Notification' in window) {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(() => {
      addNotification({
        title: 'Starting export ...',
        message: `Your video has started processing`,
        vibrate: 1,
        icon: '/favicon.png',
        native: true // when using native, your OS will handle theming.
      })
    })
  }
}

const { updateCurrentFile, oldFiles, updateLoadedFiles } = FileStore

const { updateBlobUrl } = VideoStore

const { clearTerminal } = terminalStore

const { updateUsageCount } = UserStore

const onSubmitHandler = async () => {
  const start = new Date().getTime()

  const { configuration, chosenFeatures } = CluiStore

  const loadedFiles = (await electronWrapper(
    loadFiles,
    electronLoadFiles
  )) as FileNameTypes

  updateLoadedFiles(loadedFiles)

  let currentFile: CustomFileType = setCurrentFile(loadedFiles)

  updateCurrentFile(currentFile)

  for (const key of chosenFeatures) {
    const CurrentFeature = features[key.name].feature

    // @ts-ignore Fix with @lunaroyster later
    const featureObject = new CurrentFeature({
      ...configuration,
      KEY_CONFIG: { ...key.configuration, value: 0 }
    })

    const { primaryType } = featureObject.fileConfig

    if (primaryType !== 'video') {
      const primaryLoadedFiles = loadedFiles[primaryType as FileTypes]
      if (primaryLoadedFiles && primaryLoadedFiles.length) {
        currentFile = {
          name: primaryLoadedFiles[0].name,
          path: primaryLoadedFiles[0].path,
          type: primaryType as FileTypes
        }
      }
      updateCurrentFile(currentFile)
    }
    if (currentFile) {
      featureObject.setProgress()

      featureObject.updateProgress()

      // Expectation is each feature to run in blocking
      // eslint-disable-next-line no-await-in-loop
      currentFile = await featureObject.runFFmpeg()
    }
  }

  const processedFile = (await electronWrapper(
    async () => {
      return await ffmpegReader(currentFile.name)
    },
    () => {
      return electron.readFile(currentFile.name)
    }
  )) as Uint8Array | Buffer

  const blobUrl = createVideoObject(processedFile)

  updateBlobUrl(blobUrl)

  try {
    if (!isElectron) {
      await ffmpegGarbageCollector([...oldFiles, currentFile.name])
    }
  } catch (err) {
    console.info('Unable to garbage collect', err)
  }

  updateUsageCount()

  updateProcessedState(true)

  const end = new Date().getTime()

  const encodeTime = (end - start) / 1000

  updateData(encodeTime)

  clearTerminal()

  const successMsg = `Done, Enjoy your video! The process was completed in ${encodeTime} seconds`

  console.log(successMsg) // Updates terminal

  toast.success(successMsg, { duration: 20000 })

  addNotification({
    title: 'Your video is processed!',
    message: `Your video was processed in ${encodeTime} seconds`,
    duration: 20000,
    vibrate: 1,
    icon: '/favicon.png',
    native: true // when using native, your OS will handle theming.
  })
}

export default onSubmitHandler
export { loadFFmpeg }
