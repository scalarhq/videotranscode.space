import React, { useState } from 'react'
import Draggable from 'react-draggable'

import { FileWithMetadata } from '../../types/fileTypes'

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

  const thumbs = files.map(({ file, preview }) => (
    <Draggable grid={[50, 50]} {...dragHandlers} key={file.name}>
      <div
        className="thumb"
        key={file.name.replace('-', '').replace('.', '').replace(' ', '_')}>
        <div className="thumb-inner">
          <img src={preview} alt={file.name} className="thumb-img" />
        </div>
      </div>
    </Draggable>
  ))
  return <div>{thumbs}</div>
}

export default DraggableWrapper
