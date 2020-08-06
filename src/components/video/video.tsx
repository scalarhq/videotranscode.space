/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/media-has-caption */
import React, {
  useEffect, useRef, useState,
} from 'react';

const Video = ({ url }: { url: string }) => {
  const videoDom = React.useRef<null | HTMLVideoElement>(null);

  const [aspectRatioPadding, setAspectRatio] = useState('56.25%');

  useEffect(() => {
    const video = videoDom.current as HTMLVideoElement;
    const player = document.querySelector('.player') as HTMLElement;
    const playBtn = document.querySelector('.play-btn') as Element;
    const volumeBtn = document.querySelector('.volume-btn') as HTMLElement;
    const volumeSlider = document.querySelector('.volume-slider') as HTMLElement;
    const volumeFill = document.querySelector('.volume-filled') as HTMLElement;
    const progressSlider = document.querySelector('.progress') as HTMLElement;
    const progressFill = document.querySelector('.progress-filled') as HTMLElement;
    const textCurrent = document.querySelector('.time-current') as HTMLElement;
    const textTotal = document.querySelector('.time-total');
    const speedBtns = document.querySelectorAll('.speed-item');
    const fullscreenBtn = document.querySelector('.fullscreen') as HTMLElement;

    // GLOBAL VARS
    let lastVolume = 1;
    let isMouseDown = false;

    // PLAYER FUNCTIONS
    function togglePlay() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      playBtn.classList.toggle('playing');
    }
    function togglePlayBtn() {
      playBtn.classList.toggle('paused');
    }
    function toggleMute() {
      if (video.volume) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeBtn.classList.add('muted');
        volumeFill.style.width = '0';
      } else {
        video.volume = lastVolume;
        volumeBtn.classList.remove('muted');
        volumeFill.style.width = `${lastVolume * 100}%`;
      }
    }
    function changeVolume(e: MouseEvent) {
      volumeBtn.classList.remove('muted');
      let volume = e.offsetX / volumeSlider.offsetWidth;
      volume = volume < 0.1 ? 0 : volume;
      volumeFill.style.width = `${volume * 100}%`;
      video.volume = volume;
      if (volume > 0.7) {
        volumeBtn.classList.add('loud');
      } else if (volume < 0.7 && volume > 0) {
        volumeBtn.classList.remove('loud');
      } else if (volume === 0) {
        volumeBtn.classList.add('muted');
      }
      lastVolume = volume;
    }
    function neatTime(time: number) {
      // let hours = Math.floor((time % 86400)/3600)
      const minutes = Math.floor((time % 3600) / 60);
      let seconds: number | string = Math.floor(time % 60);
      seconds = seconds > 9 ? seconds : `0${seconds}`;
      return `${minutes}:${seconds}`;
    }
    function updateProgress(e: Event) {
      progressFill.style.width = `${(video.currentTime / video.duration)
        * 100}%`;
      textCurrent.innerHTML = `${neatTime(video.currentTime)} / ${neatTime(
        video.duration,
      )}`;
      // textTotal.innerHTML = neatTime(video.duration);
      // console.log(progressFill.style.width);
    }
    function setProgress(e: MouseEvent) {
      const newTime = e.offsetX / progressSlider.offsetWidth;
      progressFill.style.width = `${newTime * 100}%`;
      video.currentTime = newTime * video.duration;
    }
    function launchIntoFullscreen(element: Element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
        // @ts-ignore Not on actual browser specification
      } else if (element.mozRequestFullScreen) {
        // @ts-ignore Not on actual browser specification
        element.mozRequestFullScreen();
        // @ts-ignore Not on actual browser specification
      } else if (element.webkitRequestFullscreen) {
        // @ts-ignore Not on actual browser specification
        element.webkitRequestFullscreen();
        // @ts-ignore Not on actual browser specification
      } else if (element.msRequestFullscreen) {
        // @ts-ignore Not on actual browser specification
        element.msRequestFullscreen();
      }
    }
    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        // @ts-ignore Not on actual browser specification
      } else if (document.mozCancelFullScreen) {
        // @ts-ignore Not on actual browser specification
        document.mozCancelFullScreen();
        // @ts-ignore Not on actual browser specification
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore Not on actual browser specification
        document.webkitExitFullscreen();
      }
    }
    let fullscreen = false;
    function toggleFullscreen() {
      if (fullscreen) { exitFullscreen(); } else { launchIntoFullscreen(player); }
      fullscreen = !fullscreen;
    }
    function setSpeed(e: Event) {
      /**
       * This in the function refers to the HTML Dom element
       */

      // @ts-ignore Type of this
      // eslint-disable-next-line react/no-this-in-sfc
      video.playbackRate = this.dataset.speed;
      speedBtns.forEach((speedBtn) => speedBtn.classList.remove('active'));
      // @ts-ignore Type of this
      // eslint-disable-next-line react/no-this-in-sfc
      this.classList.add('active');
    }
    function handleKeypress(e: globalThis.KeyboardEvent) {
      switch (e.key) {
        case ' ':
          togglePlay();
          break;
        case 'ArrowRight':
          video.currentTime += 5;
          break;
        case 'ArrowLeft':
          video.currentTime -= 5;
          break;
        default:
      }
    }

    if (videoDom && video) {
      // EVENT LISTENERS
      playBtn.addEventListener('click', togglePlay);
      video.addEventListener('click', togglePlay);
      video.addEventListener('play', togglePlayBtn);
      video.addEventListener('pause', togglePlayBtn);
      video.addEventListener('ended', togglePlayBtn);
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('canplay', updateProgress);
      volumeBtn.addEventListener('click', toggleMute);
      window.addEventListener('mousedown', () => { isMouseDown = true; });
      window.addEventListener('mouseup', () => { isMouseDown = false; });
      // volumeSlider.addEventListener('mouseover', changeVolume);
      volumeSlider.addEventListener('click', changeVolume);
      progressSlider.addEventListener('click', setProgress);
      fullscreenBtn.addEventListener('click', toggleFullscreen);
      speedBtns.forEach((speedBtn) => {
        speedBtn.addEventListener('click', setSpeed);
      });
      window.addEventListener('keydown', handleKeypress);
    }
  });
  const video = videoDom.current as HTMLVideoElement;
  // const { videoHeight, videoWidth } = video || { videoHeight: null, videoWidth: null };
  useEffect(() => {
    if (video && url) {
      video.src = url;
      video.addEventListener('loadedmetadata', (e) => {
        const { videoHeight, videoWidth } = video;
        if (videoHeight && videoWidth) {
          console.log(video, videoHeight, videoWidth);
          const aspectRatio = (videoHeight / videoWidth) * 100;
          console.log(aspectRatio);
          setAspectRatio(`${aspectRatio}%`);
        }
      });
    }
  }, [url]);

  return (
    <div className="row">
      <div className="player-container">
        <div className="player">
          <video ref={videoDom} id="video" src="" autoPlay loop playsInline />
          <div className="play-btn-big" />
          <div className="controls">
            <div className="time">
              <span className="time-current" />
              <span className="time-total" />
            </div>
            <div className="progress">
              <div className="progress-filled" />
            </div>
            <div className="controls-main">
              <div className="controls-left">
                <div className="volume">
                  <div className="volume-btn loud">
                    <svg
                      width="26"
                      height="24"
                      viewBox="0 0 26 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.75497 17.6928H2C0.89543 17.6928 0 16.7973 0
                      15.6928V8.30611C0 7.20152 0.895431 6.30611 2
                      6.30611H6.75504L13.9555 0.237289C14.6058 -0.310807 15.6
                      0.151473 15.6 1.00191V22.997C15.6 23.8475 14.6058 24.3098
                      13.9555 23.7617L6.75497 17.6928Z"
                        transform="translate(0 0.000518799)"
                        fill="white"
                      />
                      <path
                        id="volume-low"
                        d="M0 9.87787C2.87188 9.87787 5.2 7.66663 5.2 4.93893C5.2
                      2.21124 2.87188 0 0 0V2C1.86563 2 3.2 3.41162 3.2
                      4.93893C3.2 6.46625 1.86563 7.87787 0 7.87787V9.87787Z"
                        transform="translate(17.3333 7.44955)"
                        fill="white"
                      />

                      <path
                        id="volume-high"
                        d="M0 16.4631C4.78647 16.4631 8.66667 12.7777 8.66667
                      8.23157C8.66667 3.68539 4.78647 0 0 0V2C3.78022 2 6.66667
                      4.88577 6.66667 8.23157C6.66667 11.5773 3.78022 14.4631 0
                      14.4631V16.4631Z"
                        transform="translate(17.3333 4.15689)"
                        fill="white"
                      />
                      <path
                        id="volume-off"
                        d="M1.22565 0L0 1.16412L3.06413 4.0744L0 6.98471L1.22565
                      8.14883L4.28978 5.23853L7.35391 8.14883L8.57956
                      6.98471L5.51544 4.0744L8.57956 1.16412L7.35391 0L4.28978
                      2.91031L1.22565 0Z"
                        transform="translate(17.3769 8.31403)"
                        fill="white"
                      />
                    </svg>

                  </div>
                  <div className="volume-slider">
                    <div className="volume-filled" />
                  </div>
                </div>
              </div>
              <div className="play-btn paused" />
              <div className="controls-right">
                <div className="speed">
                  <ul className="speed-list">
                    <li className="speed-item" data-speed="0.5">0.5x</li>
                    <li className="speed-item" data-speed="0.75">0.75x</li>
                    <li className="speed-item active" data-speed="1">1x</li>
                    <li className="speed-item" data-speed="1.5">1.5x</li>
                    <li className="speed-item" data-speed="2">2x</li>
                  </ul>
                </div>
                <div className="fullscreen">
                  <svg
                    width="30"
                    height="22"
                    viewBox="0 0 30 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0V-1.5H-1.5V0H0ZM0 18H-1.5V19.5H0V18ZM26
                    18V19.5H27.5V18H26ZM26 0H27.5V-1.5H26V0ZM1.5
                    6.54545V0H-1.5V6.54545H1.5ZM0 1.5H10.1111V-1.5H0V1.5ZM-1.5
                    11.4545V18H1.5V11.4545H-1.5ZM0
                    19.5H10.1111V16.5H0V19.5ZM24.5
                    11.4545V18H27.5V11.4545H24.5ZM26
                    16.5H15.8889V19.5H26V16.5ZM27.5
                    6.54545V0H24.5V6.54545H27.5ZM26 -1.5H15.8889V1.5H26V-1.5Z"
                      transform="translate(2 2)"
                      fill="white"
                    />
                  </svg>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {` 
        :root {
          --accent: #0094ff;
          /* --accent: #d7577e; */

          --main: #ffffff;
        }
        .player {
          width: 100%;
          height: 0;
          padding-bottom: ${aspectRatioPadding};
          box-shadow: 0px 10px 0px -3px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          background: #000000;
        }
        .player:fullscreen {
          padding-bottom: 100vh;
        }
        .player:-webkit-full-screen {
          padding-bottom: 100vh;
        }
        .player:-moz-full-screen {
          padding-bottom: 100vh;
        }
        .player:-ms-fullscreen {
          padding-bottom: 100vh;
        }
        .player video {
          width: 100%;
          height: auto;
          position: relative;
          /* top: 50%;
          transform: translateY(-50%); */
        }
        .controls {
          padding: 0;
          position: absolute;
          bottom: -80px;
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          background: linear-gradient(
            180deg,
            rgba(37, 37, 37, 0) 10%,
            rgba(37, 37, 37, 0.6) 80%
          );
          transition: all 0.2s ease-in 5s;
        }
        .player:hover .controls {
          bottom: 0;
          transition: all 0.2s ease-out;
        }
        .time {
          position: absolute;
          right: 30px;
          bottom: 100%;
          padding-bottom: 14px;
        }
        .progress {
          height: 8px;
          width: calc(100% - 40px);
          background: rgba(60, 60, 60, 0.6);
          margin: auto;
          border-radius: 6px;
          position: absolute;
          left: 20px;
          bottom: 100%;
          transition: height 0.1s ease-in-out;
        }
        .progress:hover {
          height: 10px;
        }
        .progress-filled {
          background: var(--accent);
          width: 0%;
          height: 100%;
          border-radius: 6px;
          transition: all 0.1s;
        }
        .controls-main {
          width: calc(100% - 40px);
          margin: auto;
          height: 100%;
          display: flex;
          justify-content: space-between;
        }
        .controls-left,
        .controls-right {
          flex: 1;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .controls-left {
          margin-left: 10px;
        }
        .controls-right {
          margin-right: 10px;
          justify-content: flex-end;
        }
        .volume {
          display: flex;
          align-items: center;
        }
        .volume-btn {
          margin-right: 10px;
        }
        .volume-btn #volume-off,
        .volume-btn #volume-high {
          opacity: 0;
        }
        .volume-btn.loud #volume-high {
          opacity: 1;
        }
        .volume-btn.muted #volume-off {
          opacity: 1;
        }
        .volume-btn.muted #volume-high,
        .volume-btn.muted #volume-low {
          opacity: 0;
        }
        .volume-slider {
          height: 8px;
          width: 80px;
          background: rgba(60, 60, 60, 0.6);
          border-radius: 6px;
          position: relative;
        }
        .volume-filled {
          background: var(--main);
          width: 100%;
          height: 100%;
          border-radius: 6px;
          transition: width 0.2s ease-in-out;
        }
        .volume-filled:hover,
        .play-btn:hover.play-btn:before,
        .play-btn:hover.play-btn:after {
          background: var(--accent);
        }
        button {
        }
        .play-btn {
          width: 30px;
          height: 30px;
          position: relative;
          margin: auto;
          transform: rotate(-90deg) scale(0.8);
          transition: -webkit-clip-path 0.3s ease-in 0.1s,
            shape-inside 0.3s ease-in 0.1s,
            transform 0.8s cubic-bezier(0.85, -0.25, 0.25, 1.425);
        }
        .play-btn.paused {
          transform: rotate(0deg);
        }
        .play-btn:before,
        .play-btn:after {
          content: "";
          position: absolute;
          background: white;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transition: inherit;
        }
        .play-btn:before {
          -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 40%, 0 40%);
          shape-inside: polygon(0 10%, 100% 10%, 100% 40%, 0 40%);
        }
        .play-btn:after {
          -webkit-clip-path: polygon(0 60%, 100% 60%, 100% 90%, 0 90%);
          shape-inside: polygon(0 60%, 100% 60%, 100% 90%, 0 90%);
        }
        .play-btn.paused:before {
          -webkit-clip-path: polygon(10% 0, 90% 51%, 90% 51%, 10% 51%);
          shape-inside: polygon(0 0, 100% 51%, 100% 51%, 0 51%);
        }
        .play-btn.paused:after {
          -webkit-clip-path: polygon(10% 49.5%, 80% 49.5%, 90% 49.5%, 10% 100%);
          shape-inside: polygon(10% 49.5%, 80% 49.5%, 90% 49.5%, 10% 100%);
        }
        button:focus {
          outline: none;
        }
        .speed-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          margin-right: 20px;
          text-align: center;
        }
        .speed-list li {
          color: var(--main);
          padding: 5px;
          cursor: default;
        }
        .speed-list li:hover,
        .speed-list li.active {
          color: var(--accent);
          font-weight: bold;
        }
        .fullscreen {
          display: flex;
          justify-content: center;
        }
  `}
      </style>
    </div>
  );
};
const DownloadButton = ({ url, ext }: { url: string, ext: string }) => {
  const downloadButton = React.useRef<null | HTMLAnchorElement>(null);
  useEffect(() => {
    if (downloadButton && downloadButton.current && url) {
      downloadButton.current.href = url;
      downloadButton.current.setAttribute('download', `output.${ext}`);
    }
  }, [url]);
  return (
    <div className="row" style={{ paddingTop: '3%' }}>
      <a id="download" ref={downloadButton} className="btn btn-primary" data-testid="download-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="22px" viewBox="0 0 20 22">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
            <g id="Artboard" transform="translate(-1627.000000, -1567.000000)" stroke="#000" strokeWidth="2">
              <g id="download" transform="translate(1628.000000, 1568.000000)">
                <path d="M0 15v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" id="Shape" />
                <path id="Shape" d="M5 10l4 4 4-4" />
                <path d="M9 0v14" id="Shape" />
              </g>
            </g>
          </g>
        </svg>
      </a>
    </div>
  );
};

type VideoProps = { url: string, toDisplay: boolean, ext: string }

const VideoWrapper = ({ url, toDisplay, ext }: VideoProps) => (
  <div>
    {toDisplay ? <Video url={url} /> : null}
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
);

export default VideoWrapper;
