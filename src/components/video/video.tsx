import '../../../node_modules/video-react/dist/video-react.css' // import css

import React, { useEffect } from 'react'
import {
  ControlBar,
  CurrentTimeDisplay,
  ForwardControl,
  PlaybackRateMenuButton,
  Player,
  ReplayControl,
  TimeDivider,
  VolumeMenuButton
} from 'video-react'

const Video = ({ url }: { url: string }) => {
  return (
    <div style={{ minWidth: '40vw', maxWidth: '60vw' }}>
      <Player autoPlay>
        <source src={url} />

        <ControlBar>
          <ReplayControl seconds={10} order={1.1} />
          <ForwardControl seconds={30} order={1.2} />
          <CurrentTimeDisplay order={4.1} />
          <TimeDivider order={4.2} />
          <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
          <VolumeMenuButton disabled />
        </ControlBar>
      </Player>
    </div>
  )
}

const GifDisplay = ({ url }: { url: string }) => {
  console.info('GifDisplay')
  return (
    <div style={{ width: '40vw' }}>
      <img
        alt="gif display"
        src={url}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
    </div>
  )
}

const DownloadButton = ({ url, ext }: { url: string; ext: string }) => {
  const downloadButton = React.useRef<null | HTMLAnchorElement>(null)
  useEffect(() => {
    if (downloadButton && downloadButton.current && url) {
      downloadButton.current.href = url
      downloadButton.current.setAttribute('download', `output.${ext}`)
    }
  }, [url, ext])
  return (
    <div className="row" style={{ paddingTop: '3%' }}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        id="download"
        ref={downloadButton}
        data-testid="download-button"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
        <svg
          className="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20">
          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
        </svg>
        <span>Download</span>
      </a>
    </div>
  )
}

type VideoProps = { url: string; toDisplay: boolean; ext: string }

const VideoWrapper = ({ url, toDisplay, ext }: VideoProps) => {
  return (
    <div>
      {toDisplay ? (
        <Video url={url} />
      ) : ext === 'gif' ? (
        <GifDisplay url={url} />
      ) : null}
      <DownloadButton url={url} ext={ext} />
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .row {
            display: flex;
            flex-direction: row;
            padding-top: 2%;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
          }
        `}
      </style>
    </div>
  )
}

export default VideoWrapper
