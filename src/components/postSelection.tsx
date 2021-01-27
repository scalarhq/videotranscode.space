/**
 * Wrapper for Progress and Video Components
 */
import ProgressBar from '@components/progress/progress'
import VideoPlayer from '@components/video/video'
import utilsStore from '@store/utilsStore'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Fade } from 'react-reveal'

const PostSelection = () => {
  const { processingState, sectionProps } = utilsStore

  useEffect(() => {}, [])

  if (processingState === 'done') {
    return (
      <Fade bottom>
        {/* @ts-ignore When processingState === 'done', sectionProps will be correct */}
        <VideoPlayer {...sectionProps} />
      </Fade>
    )
  } else {
    return (
      <Fade bottom>
        {/* @ts-ignore When processingState === 'processing', sectionProps will be correct */}
        <ProgressBar {...sectionProps} />
      </Fade>
    )
  }
}

export default observer(PostSelection)
