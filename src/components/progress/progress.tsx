import React, { useEffect } from 'react'

type ProgressProps = { progress: number; color: string; name: string }

const ProgressBar = ({ name, color, progress }: ProgressProps) => {
  const progressBar = React.useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    if (progressBar && progressBar.current) {
      progressBar.current.style.backgroundColor = color
    }
  }, [color])

  useEffect(() => {
    if (progressBar && progressBar.current) {
      if (progress > 1) {
        const styledProgress = 20 + 0.4 * progress * Math.log10(progress)
        console.info('Styled Progress', styledProgress)
        progressBar.current.style.width = `${styledProgress}%`
      }
    }
  }, [progress])

  return (
    <div>
      <div className="flex justify-center -mb-10">
        <div className="w-1/2 block object-cover rounded-lg">
          <img src="images/processing.png" alt="Processing png" />
        </div>
      </div>
      <div className="row">
        <h3 className="text-xl font-bold">{name}</h3>
      </div>
      <div className="progress-wrapper">
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            id="progress"
            ref={progressBar}
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: '20%' }}>
            {progress.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .bg-danger {
            background-color: #dc3545 !important;
          }

          .progress-wrapper {
            display: flex;
            margin: auto;
            width: 30vw;
          }
          .image-container {
            object-fit: cover;
          }
          .row {
            flex-direction: row;
            justify-content: center;
          }

          @-webkit-keyframes progress-bar-stripes {
            0% {
              background-position-x: 1rem;
            }
          }

          @keyframes progress-bar-stripes {
            0% {
              background-position-x: 1rem;
            }
          }

          .progress {
            display: flex;
            height: 1rem;
            overflow: hidden;
            font-size: 0.75rem;
            background-color: #e9ecef;
            border-radius: 0.25rem;
            width: 100%;
          }

          .progress-bar {
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            background-color: #0d6efd;
            transition: width 0.6s ease;
          }

          @media (prefers-reduced-motion: reduce) {
            .progress-bar {
              transition: none;
            }
          }

          .progress-bar-striped {
            background-image: linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.15) 25%,
              transparent 25%,
              transparent 50%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.15) 75%,
              transparent 75%,
              transparent
            );
            background-size: 1rem 1rem;
          }

          .progress-bar-animated {
            -webkit-animation: progress-bar-stripes 1s linear infinite;
            animation: progress-bar-stripes 1s linear infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .progress-bar-animated {
              -webkit-animation: none;
              animation: none;
            }
          }
        `}
      </style>
    </div>
  )
}

export default ProgressBar
