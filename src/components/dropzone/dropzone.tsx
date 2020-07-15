import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'


import "./dropzone.css"
type DropzoneProps = {
  updateFiles: any
};

const Dropzone: React.FC<DropzoneProps> = ({ updateFiles }) => {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files

    updateFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
export default Dropzone