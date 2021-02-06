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
}

type SortableFileProps = {
  id: string
  name: string
  preview: string
}

const SortableFile = ({ id, name, preview }: SortableFileProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.thumb}
      key={name.replace('-', '').replace('.', '').replace(' ', '_')}>
      <div className={styles.thumbInner}>
        <img src={preview} alt="preview" className={styles.thumbImg} />
        <p className="truncate w-40">{name}</p>
      </div>
    </div>
  )
}

const DraggableWrapper = ({ files, moveFiles }: DraggableWrapperProps) => {
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
          {files.map(file => {
            return (
              <SortableFile
                key={file.uuid}
                id={file.uuid}
                name={file.file.name}
                preview={file.preview}
              />
            )
          })}
          {addFile}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default DraggableWrapper
