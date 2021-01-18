/* eslint-disable no-nested-ternary */

import Banner from '@components/banner/banner'
import Configuration from '@components/configuration/configuration'
import Dropzone from '@components/dropzone/dropzone'
import ErrorScreen from '@components/error/Error'
import ProgressBar from '@components/progress/progress'
import { Footer, Header } from '@components/static/static'
import StepComponent from '@components/steps/steps'
import TerminalComponent from '@components/terminal/terminalComponent'
import Tour from '@components/tour/tour'
import Util from '@components/utils/util'
import VideoPlayer from '@components/video/video'
// Core
import { electronWrapper } from '@core/electron'
import processor, { loadFFmpeg } from '@core/processor'
// Stores
import ComponentStore from '@store/componentStore'
import TerminalStore from '@store/terminalStore'
import { useActiveUsers } from '@store/userStore'
import styles from '@styles/app.module.css'
import classNames from 'classnames'
// Modules
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Toaster } from 'react-hot-toast'
import { Fade } from 'react-reveal'

const App = () => {
  const {
    loaded,
    processed,
    ProgressStore,
    isLoadingError,
    loadingErrorObj,
    updateLoaded,
    updateLoadError,

    FileStore,
    CluiStore,
    VideoStore
  } = ComponentStore
  const { isSubmitted, cluiToggle } = CluiStore

  const { currentFileExtension, isDisplayable } = FileStore

  const { toDisplay, updateVideoDisplay, url } = VideoStore

  const [isLoading, setLoading] = useState(false)

  const [secondLoad, setSecondLoad] = useState(false)

  const isActiveUser = useActiveUsers()

  useEffect(() => {
    if (isLoading === false) {
      setLoading(true)
      setTimeout(() => {
        /**
         * Does not need to load ffmpeg if it is electron app
         */
        electronWrapper(loadFFmpeg, () => {
          updateLoaded(true)
        })
      }, 500)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (isSubmitted) {
      processor()
    }
  }, [isSubmitted])

  useEffect(() => {
    if (processed) {
      console.info(
        'Current Video State | Default Video State',
        toDisplay,
        isDisplayable
      )
      if (!toDisplay) {
        updateVideoDisplay(isDisplayable)
      }
    }
  }, [processed, toDisplay, isDisplayable, updateVideoDisplay])

  useEffect(() => {
    if (loaded) {
      const { updateTerminalText } = TerminalStore
      /**
       * Overriding Console for Terminal
       *
       */
      const newConsole = (oldConsole: typeof window.console) => ({
        ...oldConsole,
        log(text: any) {
          oldConsole.log(`Escaped - ${text}`)
          if (updateTerminalText) {
            updateTerminalText(text)
          }
        }
      })

      window.console = newConsole(window.console)
    }
  }, [loaded])

  useEffect(() => {
    if (isLoadingError && secondLoad === false) {
      loadFFmpeg()
      setSecondLoad(true)
      updateLoadError(false, new Error())
    }
    // eslint-disable-next-line
  }, [isLoadingError])

  if (isLoadingError && secondLoad) {
    return (
      <>
        <div className={styles.main}>
          <ErrorScreen errorObj={loadingErrorObj} />
        </div>
        <Footer />
      </>
    )
  }
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className={classNames(styles['overlay-wrapper'], 'h-screen ')}>
        {!isMobile ? (
          <div className="blur">
            <Toaster position="top-right" />

            <Banner />
            <Util />
            <Tour>
              <>
                <div className={classNames(styles.main, 'main-padding')}>
                  <div className={styles['flex-wrapper']}>
                    {!isSubmitted ? (
                      <div
                        className={styles['dropzone-wrapper']}
                        id="dropzone-wrapper">
                        <Fade bottom>
                          <Dropzone />
                        </Fade>
                      </div>
                    ) : !processed ? (
                      <Fade bottom>
                        <ProgressBar {...ProgressStore} />
                      </Fade>
                    ) : (
                      <Fade bottom>
                        <VideoPlayer
                          url={url}
                          toDisplay={toDisplay}
                          ext={currentFileExtension}
                        />
                      </Fade>
                    )}

                    {!isSubmitted ? (
                      <Fade bottom>
                        <Configuration />
                      </Fade>
                    ) : cluiToggle ? (
                      <div className={styles['terminal-wrapper']}>
                        <Fade bottom>
                          <TerminalComponent />
                        </Fade>
                      </div>
                    ) : processed ? (
                      <div className={styles['terminal-wrapper']}>
                        <Fade bottom>
                          <TerminalComponent />
                        </Fade>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <StepComponent />
                </div>

                <Header />
              </>
            </Tour>
          </div>
        ) : null}
        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
            .flex-wrapper {
              padding-top: ${isActiveUser ? '2vh' : '5vh'};
            }

            .main-padding {
              max-width: ${isSubmitted ? '80vw' : 'unset'};
              padding-top: ${isSubmitted ? '5vh' : '1rem'};
            }
            ul {
              max-width: unset !important;
              background-color: transparent !important;
            }
          `}
        </style>
      </div>

      <Footer />
    </div>
  )
}

export default observer(App)
