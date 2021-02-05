/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-spreading */
// import './dropzone.css'
import useEventListener from '@core/utils/useEventListener'
import { arrayMove } from '@dnd-kit/sortable'
import ComponentStore from '@store/componentStore'
import styles from '@styles/dropzone.module.css'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useDropzone } from 'react-dropzone'
import { GlobalHotKeys } from 'react-hotkeys'
import { v4 as uuidv4 } from 'uuid'

import {
  ElectronFile,
  FileTransformType,
  FileWithMetadata,
  WrappedFileWithMetadata
} from '~@types/fileTypes'

import DraggableWrapper from './draggable'

const { FileStore } = ComponentStore

const { updateFiles, setDropzoneRef } = FileStore

const createVideoThumbnail = (videoFile: File) => {
  const thumbnail = new Promise<{
    preview: string
    videoMetadata?: {
      height: number
      width: number
      duration: number
      otherMetadata: any
    }
  }>((resolve, reject) => {
    try {
      const videoElement = document.createElement('video')
      const canPlay = videoElement.canPlayType(videoFile.type)
      if (!canPlay) {
        // reject(new Error('Does not support video type'))
        resolve({
          preview: '/images/previews/videoPreview.png'
        })
      }
      const snapImage = () => {
        const videoCanvas = document.createElement('canvas')
        videoCanvas.width = videoElement.videoWidth
        videoCanvas.height = videoElement.videoHeight

        // @ts-ignore
        videoCanvas
          .getContext('2d')
          .drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height)

        const img = videoCanvas.toDataURL()
        const success = img.length > 100000
        if (success) {
          resolve({
            preview: img,
            videoMetadata: {
              height: videoElement.videoHeight,
              width: videoElement.videoWidth,
              duration: videoElement.duration,
              otherMetadata: videoElement
            }
          })
        }
        return success
      }
      const timeUpdate = () => {
        // console.info('Playing time update');
        if (snapImage()) {
          videoElement.removeEventListener('timeupdate', timeUpdate)
          videoElement.pause()
        }
      }
      videoElement.addEventListener('loadeddata', () => {
        if (snapImage()) {
          videoElement.removeEventListener('timeupdate', timeUpdate)
          videoElement.pause()
        }
      })

      const videoUrl = URL.createObjectURL(
        new Blob([videoFile], { type: videoFile.type })
      )
      videoElement.addEventListener('timeupdate', timeUpdate)
      videoElement.preload = 'metadata'
      videoElement.src = videoUrl
      videoElement.muted = true
      // @ts-ignore playsInline is supported by video elements
      videoElement.playsInline = true
      videoElement.play()
    } catch (err) {
      console.error(err)
      reject(new Error(err.message))
    }
  })
  return thumbnail
}

type DropzoneProps = {
  acceptedFiles?: string[]
}

const Dropzone = ({ acceptedFiles }: DropzoneProps) => {
  const [files, setFiles] = useState<Array<WrappedFileWithMetadata>>([])

  const [scroll, setScroll] = useState(0)

  const [loading, setLoading] = useState(false)

  const dropzoneRef = React.useRef<HTMLDivElement | null>(null)

  const thumbnailRef = React.useRef<HTMLDivElement | null>(null)

  const { globalReset } = ComponentStore

  useBeforeunload(() => 'Your video will stop processing!')

  useEffect(() => {
    if (globalReset) {
      setFiles([])
    }
  }, [globalReset])

  useEffect(() => {
    setDropzoneRef(dropzoneRef)
    return () => {
      delete FileStore.dropzoneRef
    }
  }, [])

  const translateScroll = (e: WheelEvent) => {
    e.stopPropagation()
    document.body.style.overflowY = 'hidden'
    const maxScroll = thumbnailRef?.current?.scrollHeight || 500
    if (e.deltaY < 0 && scroll > 0) {
      setScroll(s => s - 10)
    } else if (e.deltaY > 0 && scroll < maxScroll) {
      setScroll(s => s + 10)
    }
    if (thumbnailRef && thumbnailRef.current) {
      thumbnailRef.current.scrollTo({ top: scroll, behavior: 'smooth' })
    }
  }

  useEventListener(dropzoneRef, 'wheel', translateScroll)

  const onDrop = useCallback(async acceptedFiles => {
    // Do something with the files

    const newFiles: Array<FileWithMetadata> = await Promise.all(
      acceptedFiles.map(async (file: ElectronFile) => {
        // TODO (rahul) Fix Promise waiting
        if (file.type.match('image')) {
          return {
            file,
            preview: URL.createObjectURL(file),
            path: file.path || '',
            customType: 'image'
          }
        }
        if (file.type.match('video')) {
          // Generate preview for Video
          try {
            const videoData = await createVideoThumbnail(file)
            return {
              file,
              preview: videoData.preview,
              path: file.path || '',
              customType: 'video',
              videoMetadata: videoData.videoMetadata
            }
          } catch (err) {
            return {
              file,
              preview: '',
              path: file.path || '',
              customType: 'video'
            }
          }
        }
        if (file.type.match('audio')) {
          return {
            file,
            preview: '/images/previews/audioPreview.png',
            customType: 'audio',
            path: file.path || ''
          }
        }

        return { file, preview: '', customType: 'other', path: file.path || '' }
      })
    )
    const transforms: FileTransformType[] = []
    for (const newFile of newFiles) {
      const newTransform: FileTransformType = {
        type: newFile.customType,
        fileObj: newFile,
        state: 'Insert'
      }
      transforms.push(newTransform)
    }
    updateFiles(transforms)

    setFiles(f =>
      f.concat(
        newFiles.map(newFile => ({ uuid: uuidv4(), fileWithMetadata: newFile }))
      )
    )
  }, [])

  const handleDemoVideo = async (e: React.MouseEvent) => {
    setLoading(true)
    e.stopPropagation()
    const demoFile = await fetch('/modfyDemo.webm')
    const blob = await demoFile.blob()
    const file: File = new File([blob], 'modfyDemo.webm', {
      type: 'video/webm'
    })
    const videoData = await createVideoThumbnail(file)
    const fileWithMetadata: FileWithMetadata = {
      file,
      preview: videoData.preview,
      customType: 'video',
      videoMetadata: videoData.videoMetadata
    }
    const newTransform: FileTransformType = {
      type: fileWithMetadata.customType,
      fileObj: fileWithMetadata,
      state: 'Insert'
    }
    updateFiles([newTransform])
    setFiles(f => f.concat([{ uuid: uuidv4(), fileWithMetadata }]))
    setLoading(false)
  }

  /**
   * This function gets passed down to DraggableWrapper.
   *
   * It updates the local files state and dispatches the
   * move transform to the files store.
   */
  const moveFiles = (
    oldIndex: number,
    newIndex: number,
    file: FileWithMetadata
  ) => {
    setFiles(items => {
      updateFiles([
        {
          type: file.customType,
          fileObj: file,
          state: 'Move',
          position: oldIndex,
          secondPosition: newIndex
        }
      ])
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  useEffect(() => {
    files.forEach(file => {
      if (file.fileWithMetadata.preview)
        URL.revokeObjectURL(file.fileWithMetadata.preview)
    })
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles ?? ['video/*', 'image/*', 'audio/*']
  })

  const keyMap = {
    FILE_DRAWER: ['shift+f']
  }

  const handlers = {
    FILE_DRAWER: (e?: KeyboardEvent) => {
      e?.preventDefault()
      document.getElementById('file-input')?.click()
    }
  }

  if (files.length === 0) {
    return (
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <div className={styles.previewWrapper}>
          <div
            className={classNames(styles.dropzone, 'dropzone-translate')}
            id="dropzone"
            {...getRootProps()}>
            <div className={styles.scrollableWrapper} ref={dropzoneRef}>
              <input id="file-input" {...getInputProps()} />
              <div className="w-1/3 px-2">
                <img alt="Video file svg" src="/images/upload.svg" />
              </div>
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>
                  <u>Click</u> or Drag to add files.{' '}
                </p>
              )}
              <button
                type="button"
                onClick={handleDemoVideo}
                disabled={loading}
                className="inline-flex z-20 items-center mt-10 px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 ..."
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : null}
                Use a demo file
                {!loading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="ml-3 -mr-1 h-5 w-5"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                ) : null}
              </button>
            </div>
            {/* @ts-ignore Styled JSX */}
            <style jsx>
              {`
                .dropzone {
                  width: ${files.length > 0 ? '90%' : '100%'};
                }
              `}
            </style>
          </div>
        </div>
      </GlobalHotKeys>
    )
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()

    // Call the drop function to simulate the file being
    // dropped to the dropzone.
    onDrop(
      Array(e.dataTransfer.files.length)
        .fill(0)
        .map((_, idx) => e.dataTransfer.files.item(idx))
    )
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      <div className={styles.previewWrapper}>
        <div id="dropzone" style={{ cursor: 'default' }} {...getRootProps()}>
          <div className={styles.scrollableWrapper} ref={dropzoneRef}>
            <input id="file-input" {...getInputProps()} />
          </div>
          {/* @ts-ignore Styled JSX */}
          <style jsx>
            {`
              .dropzone {
                width: ${files.length > 0 ? '90%' : '100%'};
              }
            `}
          </style>
        </div>
        <aside
          ref={thumbnailRef}
          className={styles.thumbsContainer}
          onDrop={e => handleDrop(e)}>
          <DraggableWrapper
            getRootProps={getRootProps}
            files={files}
            moveFiles={moveFiles}
          />
        </aside>
      </div>
    </GlobalHotKeys>
  )
}
export default observer(Dropzone)
