import FileStore from '../store/fileStore'
import { FileString, FileTypes } from '../types/fileTypes'
import { ffmpegWriter } from './ffmpeg'

/**
 * Loads Originally Uploaded Files into FFmpeg Memory
 */
const loadFiles = async () => {
  const { files } = FileStore
  const uploadFiles: {
    [name in FileTypes]: Array<Promise<FileString>>
  } = {
    audio: [],
    video: [],
    image: [],
    other: []
  }

  for (const type of ['audio', 'video', 'image']) {
    const currentFileList = files[type as FileTypes]
    if (currentFileList) {
      for (const fileObj of currentFileList) {
        uploadFiles[type as FileTypes].push(ffmpegWriter(fileObj.file))
      }
    }
  }
  return {
    video: await Promise.all(uploadFiles.video),
    audio: await Promise.all(uploadFiles.audio),
    image: await Promise.all(uploadFiles.image),
    other: await Promise.all(uploadFiles.other)
  }
}

export default loadFiles
