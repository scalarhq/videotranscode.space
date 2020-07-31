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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      {/* @ts-ignore */}
      <style jsx>
        {`
          .dropzone {
            display : flex;
            height: 35vh;
            text-align: center;
            justify-content: center;
            align-items: center;
          }
         
        `}

      </style>
    </div>
  );
};
export default Dropzone;
