/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import './dropzone.css';

import FileStore from '../../store/fileStore';

const { updateFiles } = FileStore;

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    updateFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ['video/*', 'image/*'] });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
    </div>
  );
};
export default Dropzone;
