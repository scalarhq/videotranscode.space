/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDropzone } from 'react-dropzone';

import './dropzone.css';

import FileStore from '../../store/fileStore';

import { FileTransformType, FileWithPreview } from '../../types/fileTypes';

import DraggableWrapper from './draggable';

import useEventListener from '../../ts/useEventListener';

const { updateFiles } = FileStore;

const createVideoThumbnail = (videoFile: File) => {
  const thumbnail = new Promise<string>((resolve, reject) => {
    try {
      const videoElement = document.createElement('video');
      const canPlay = videoElement.canPlayType(videoFile.type);
      if (!canPlay) {
        reject(new Error('Does not support video type'));
      }
      const snapImage = () => {
        const videoCanvas = document.createElement('canvas');
        videoCanvas.width = videoElement.videoWidth;
        videoCanvas.height = videoElement.videoHeight;

        // @ts-ignore
        videoCanvas.getContext('2d').drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height);

        const img = videoCanvas.toDataURL();
        const success = img.length > 100000;
        if (success) {
          resolve(img);
        }
        return success;
      };
      const timeUpdate = () => {
        // console.info('Playing time update');
        if (snapImage()) {
          videoElement.removeEventListener('timeupdate', timeUpdate);
          videoElement.pause();
        }
      };
      videoElement.addEventListener('loadeddata', () => {
        console.info('Loaded MetaData');
        if (snapImage()) {
          videoElement.removeEventListener('timeupdate', timeUpdate);
          videoElement.pause();
        }
      });

      const videoUrl = URL.createObjectURL(new Blob([videoFile], { type: videoFile.type }));
      videoElement.addEventListener('timeupdate', timeUpdate);
      videoElement.preload = 'metadata';
      videoElement.src = videoUrl;
      videoElement.muted = true;
      // @ts-ignore playsInline is supported by video elements
      videoElement.playsInline = true;
      videoElement.play();
    } catch (err) {
      console.error(err);
      reject(new Error(err.message));
    }
  });
  return thumbnail;
};

const Dropzone = () => {
  const [files, setFiles] = useState<Array<FileWithPreview>>([]);

  const [scroll, setScroll] = useState(0);

  const dropzoneRef = React.useRef<HTMLDivElement | null>(null);

  const thumbnailRef = React.useRef<HTMLDivElement | null>(null);

  const translateScroll = (e: WheelEvent) => {
    const maxScroll = thumbnailRef?.current?.scrollHeight || 500;
    if (e.deltaY < 0 && scroll > 0) {
      setScroll((s) => s - 10);
    } else if (e.deltaY > 0 && scroll < maxScroll) {
      setScroll((s) => s + 10);
    }
    if (thumbnailRef && thumbnailRef.current) {
      thumbnailRef.current.scrollTo({ top: scroll, behavior: 'smooth' });
    }
  };

  useEventListener(dropzoneRef, 'wheel', translateScroll);

  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    const newFiles: Array<FileWithPreview> = await Promise.all(acceptedFiles.map(
      async (file: File) => {
        if (file.type.match('image')) {
          return Object.assign(file, { preview: URL.createObjectURL(file), customType: 'image' });
        }
        if (file.type.match('video')) {
          // Generate preview for Video
          try {
            const videoThumbnail = await createVideoThumbnail(file);
            return Object.assign(file, { preview: videoThumbnail, customType: 'video' });
          } catch (err) {
            return Object.assign(file, { preview: '', customType: 'video' });
          }
        }
        if (file.type.match('audio')) {
          return Object.assign(file, { preview: '', customType: 'audio' });
        }

        return Object.assign(file, { preview: '', customType: 'other' });
      },
    ));
    const transforms: FileTransformType[] = [];
    for (const newFile of newFiles) {
      const newTransform: FileTransformType = { type: newFile.customType, file: newFile, state: 'Insert' };
      transforms.push(newTransform);
    }
    updateFiles(transforms);

    setFiles((f) => f.concat(newFiles));
  }, []);

  useEffect(() => {
    files.forEach((file) => { if (file.preview) URL.revokeObjectURL(file.preview); });
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ['video/*', 'image/*', 'audio/*'] });

  return (
    <div className="preview-wrapper">

      <div className="dropzone outline-none" id="dropzone" {...getRootProps()}>
        <div className="scrollable-wrapper outline-none" ref={dropzoneRef}>
          <input {...getInputProps()} />

          {files.length > 0 ? null
            : (
              <>
                <div className="w-1/3 px-2">
                  <img alt="Video file svg" src="images/upload.svg" />
                </div>
                {isDragActive
                  ? <p>Drop the files here ...</p>
                  : (
                    <p>
                      <u>Click</u>
                      {' '}
                      or Drag to upload
                      {' '}
                    </p>
                  )}

              </>
            )}
        </div>
        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
          .dropzone {
            width : ${files.length > 0 ? '90%' : '100%'};
          }
          `}
        </style>
      </div>
      <aside ref={thumbnailRef} className="thumbs-container">
        <DraggableWrapper files={files} />
      </aside>
    </div>
  );
};
export default Dropzone;
