import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from '@styles/dropzone.module.css'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { FileWithMetadata } from '~@types/fileTypes'

type DraggableWrapperProps = {
  files: FileWithMetadata[]
  moveFiles: (
    oldIndex: number,
    newIndex: number,
    file: FileWithMetadata
  ) => void
  deleteFile: (index: number, file: FileWithMetadata) => void
}

type SortableFileProps = {
  file: FileWithMetadata
  moveFiles: (
    oldIndex: number,
    newIndex: number,
    file: FileWithMetadata
  ) => void
  deleteFile: (index: number, file: FileWithMetadata) => void
}

const SortableFile = ({ file, deleteFile, moveFiles }: SortableFileProps) => {
  const [visible, setVisible] = useState(false)
  const {
    file: { name },
    preview,
    uuid
  } = file
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    index
  } = useSortable({ id: uuid })

  const style = {
    transform: CSS.Transform.toString(
      {
        ...transform!,
        scaleX: 1,
        scaleY: 1
      } || {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      }
    ),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      // @ts-ignore
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.thumb} scale`}
      key={name.replace('-', '').replace('.', '').replace(' ', '_')}>
      <div
        className={classNames(
          styles.thumbInner,
          index === 0
            ? 'text-white transition-all duration-200 ease-in-out'
            : ''
        )}
        onClick={() => {
          if (index !== 0) {
            moveFiles(index, 0, file)
          }
        }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}>
        <img
          className={index !== 0 ? styles.thumbImg : styles.thumbImgLarge}
          alt="Thumbanil preview"
          src={preview}></img>

        <button
          className={`${
            visible ? 'opacity-100' : 'opacity-0'
          } fixed top-3 right-3 block float-right  transition-all duration-200 ease-in-out`}
          onClick={() => deleteFile(index, file)}>
          <svg
            className="w-6 h-6 text-red-600 subpixel-antialiased"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <p className="truncate w-40 text-gray-200">{name}</p>
      </div>
    </div>
  )
}

const DraggableWrapper = ({
  files,
  moveFiles,
  deleteFile
}: DraggableWrapperProps) => {
  const [fileIDs, setFileIDs] = useState<string[]>(files.map(file => file.uuid))

  useEffect(() => {
    files.forEach((file, idx) => console.log(`${idx}. ${file.file.name}`))
    setFileIDs(files.map(file => file.uuid))
  }, [files])

  const addFile = (
    <div
      className={styles.thumb}
      style={{ cursor: 'pointer' }}
      onClick={() => document.getElementById('file-input')?.click()}>
      <div className={styles.thumbInner}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-24 h-24 text-indigo-500 hover:text-indigo-600"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <p className="text-green-500">
          <b>Add</b> more files
        </p>
      </div>
    </div>
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      moveFiles(
        fileIDs.indexOf(active.id),
        fileIDs.indexOf(over.id),
        files.find(file => file.uuid === fileIDs[fileIDs.indexOf(active.id)])!
      )
    }
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext items={fileIDs} strategy={rectSortingStrategy}>
          {files.map(file => (
            <SortableFile
              key={file.uuid}
              file={file}
              deleteFile={deleteFile}
              moveFiles={moveFiles}
            />
          ))}
          {addFile}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default DraggableWrapper
