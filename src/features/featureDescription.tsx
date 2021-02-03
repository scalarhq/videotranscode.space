/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'

type DescriptionFile = {
  types: Array<'video' | 'audio' | 'image'>
  description: string
}

type FeatureDescriptionProps = {
  name: string
  description: string
  extraDescription?: string
  fileInput: DescriptionFile
  fileOutput: DescriptionFile
  colors?: {
    [name: string]: any
  }
}

const defaultDescriptionFile: DescriptionFile = {
  types: ['video'],
  description: 'Video File'
}

const imageArrangement = (imgType: string, idx: number) => {
  switch (imgType) {
    case 'video':
      return (
        <img
          alt="Video Preview"
          key={`video-preview-${idx}`}
          className="w-20 h-20"
          src="/images/previews/videoPreview.png"></img>
      )
    case 'image':
      return (
        <div
          key={`image-preview-${idx}`}
          className="relative rounded-lg pl-6 py-2 shadow-sm flex items-center space-x-3">
          <img
            alt="Image Preview"
            className="w-12 h-12"
            src="/images/previews/imagePreview.png"></img>
        </div>
      )
    case 'audio':
      return (
        <div
          key={`audio-preview-${idx}`}
          className="relative rounded-lg pl-6 py-2 shadow-sm flex items-center space-x-3">
          <img
            alt="Audio Preview"
            className="w-12 h-12"
            src="/images/previews/audioPreview.png"></img>
        </div>
      )
  }
}

const FeatureDescription = ({
  name,
  description,
  extraDescription,
  fileInput = defaultDescriptionFile,
  fileOutput = defaultDescriptionFile
}: FeatureDescriptionProps) => {
  return (
    <div key={name} className="flex flex-col py-5 pt-10 w-full items-center">
      <p className="text-3xl uppercase text-gray-50">{name}</p>
      <p className="text-xl py-2 text-gray-300">{description}</p>
      {extraDescription && (
        <p className="text-md py-1 text-gray-400">{extraDescription}</p>
      )}
      <div className="flex w-full pt-5 items-center justify-center">
        <div className="w-1/3 flex flex-col items-center">
          <div
            className={
              fileInput.types.length > 1
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
                : 'flex w-full justify-center'
            }>
            {fileInput.types.map((type, index) => {
              return imageArrangement(type, index)!
            })}
          </div>
        </div>
        <div className="w-1/5 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-20 h-20 text-default"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div
            className={
              fileOutput.types.length > 1
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
                : 'flex w-full justify-center'
            }>
            {fileOutput.types.map((type, index) => {
              return imageArrangement(type, index)!
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full pt-3 items-center justify-center">
        <div className="w-1/3 flex flex-col items-center">
          <p className="text-md text-gray-300 text-center">
            {fileInput.description}
          </p>
        </div>
        <div className="w-1/5 flex justify-center"></div>
        <div className="w-1/3 flex flex-col items-center">
          <p className="text-md text-gray-300 text-center">
            {fileOutput.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeatureDescription
