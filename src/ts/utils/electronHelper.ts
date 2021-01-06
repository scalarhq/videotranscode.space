import FileStore from '../../store/fileStore'
import { ReturnedImage, TransitImage } from '../../types/electronApi'
import { FileWithMetadata } from '../../types/fileTypes'
import electron from '../electron'

/**
 * Replaces the WASM file loader for an electron file loader
 *
 * This file loader does not actually load any files except images into fs
 */
export const electronLoadFiles = async () => {
  const { files } = FileStore

  return {
    video: files.video?.map(f => {
      return { name: f.file.name, path: f.path || '' }
    }),
    image: await electronLoadImages(files.image),
    audio: files.audio?.map(f => {
      return { name: f.file.name, path: f.path || '' }
    }),
    other: files.other?.map(f => {
      return { name: f.file.name, path: f.path || '' }
    })
  }
}

/**
 * Takes image objects in javascript and saves them in the temp folder on filesystem
 * Abstracted through the electron api which returns a {@link ReturnedImage} object for each image
 * @param images Array of {@link FileWithMetadata} or undefined in which case just returns {}
 */
const electronLoadImages = async (images: FileWithMetadata[] | undefined) => {
  if (!images) return {}

  const bufferPromises = []

  for (const image of images) {
    const newArrayBuffer = image.file.arrayBuffer()
    bufferPromises.push(newArrayBuffer)
  }

  const arrayBuffers = await Promise.all(bufferPromises)

  const imageWithBuffer: TransitImage[] = images.map((img, index) => {
    return { name: img.file.name, arrayBuffer: arrayBuffers[index] }
  })

  const processedImages: ReturnedImage[] = await electron.saveImages(
    imageWithBuffer
  )

  console.info(processedImages)
  return processedImages
}
