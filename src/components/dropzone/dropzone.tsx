/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import './dropzone.css';

type DropzoneProps = {
  updateFiles: any,
};

const Dropzone: React.FC<DropzoneProps> = ({ updateFiles }: DropzoneProps) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    updateFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
          <p>Drag &apos n &apos drop some files here, or click to select files</p>
        )}
    </div>
  );
};
export default Dropzone;
