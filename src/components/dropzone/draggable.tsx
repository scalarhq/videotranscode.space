import styles from '@styles/dropzone.module.css'
import React, { useState } from 'react'
import Draggable from 'react-draggable'

import { FileWithMetadata } from '~@types/fileTypes'

type DraggableWrapperProps = {
  files: FileWithMetadata[]
}

const DraggableWrapper = ({ files }: DraggableWrapperProps) => {
  const [activeDrags, setActiveDrags] = useState(0)
  // const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const onStart = () => {
    setActiveDrags(activeDrags + 1)
  }

  const onStop = () => {
    setActiveDrags(activeDrags - 1)
  }

  const dragHandlers = { onStart, onStop }

  const addFile = (
    <Draggable grid={[50, 50]} {...dragHandlers} key="addFile">
      <div className={styles.thumb}>
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
    </Draggable>
  )

  const thumbs = files.map(({ file, preview }) => (
    <Draggable grid={[50, 50]} {...dragHandlers} key={file.name}>
      <div
        className={styles.thumb}
        key={file.name.replace('-', '').replace('.', '').replace(' ', '_')}>
        <div className={styles.thumbInner}>
          <img src={preview} alt="preview" className={styles.thumbImg} />
          <p className="truncate w-40">{file.name}</p>
        </div>
      </div>
    </Draggable>
  ))
  if (files.length > 0) {
    thumbs.push(addFile)
  }

  return <div>{thumbs}</div>
}

export default DraggableWrapper
