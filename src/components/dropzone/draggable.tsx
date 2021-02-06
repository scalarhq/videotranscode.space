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
  deleteFile: (index: number, file: FileWithMetadata) => void
}

const SortableFile = ({ file, deleteFile }: SortableFileProps) => {
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
        scaleX: index === 0 ? 1.25 : 1,
        scaleY: index === 0 ? 1.25 : 1
      } || {
        x: 0,
        y: 0,
        scaleX: index === 0 ? 1.25 : 1,
        scaleY: index === 0 ? 1.25 : 1
      }
    ),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.thumb} scale`}
      key={name.replace('-', '').replace('.', '').replace(' ', '_')}>
      <div className={styles.thumbInner}>
        <div
          style={{ background: `url('${preview}')`, backgroundSize: 'contain' }}
          className={styles.thumbImg}>
          <button
            className={'block float-right ' + (index === 0 ? 'pt-3' : '')}
            onClick={() => deleteFile(index, file)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
        <p className="truncate w-40">{name}</p>
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
        <p>
          <u>Add</u> more files!
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
      console.log(
        `Active: ${fileIDs.indexOf(active.id)} Over: ${fileIDs.indexOf(
          over.id
        )}`
      )
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
            <SortableFile key={file.uuid} file={file} deleteFile={deleteFile} />
          ))}
          {addFile}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default DraggableWrapper
