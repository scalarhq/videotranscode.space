import styles from '@styles/progress.module.css'
import classNames from 'classnames'
import React, { useEffect } from 'react'
import { useBeforeunload } from 'react-beforeunload'

export type ProgressProps = { progress: number; color: string; name: string }

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

  useBeforeunload(() => 'Your video will stop processing!')

  return (
    <div>
      <div className="flex justify-center -mb-10">
        <div className="w-1/2 block object-cover rounded-lg">
          <img src="/images/processing.png" alt="Processing png" />
        </div>
      </div>
      <div className="row">
        <h3 className="text-xl font-bold text-center py-2">{name}</h3>
      </div>
      <div className={styles['progress-wrapper']}>
        <div className={styles.progress}>
          <div
            className={classNames(
              styles['progress-bar'],
              styles['progress-bar-striped'],
              styles['progress-bar-animated']
            )}
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
    </div>
  )
}

export default ProgressBar
