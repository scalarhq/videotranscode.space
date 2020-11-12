/* eslint-disable no-nested-ternary */

// Modules
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'

import { Fade } from 'react-reveal'
import { isMobile } from 'react-device-detect'
import processor, { loadFFmpeg } from './ts/processor'

// Styling
import './App.css'

// Router
import Router from './router'

// Components
import { Header, Footer } from './components/static/static'
import Dropzone from './components/dropzone/dropzone'
import TerminalComponent from './components/terminal/terminalComponent'
import ProgressBar from './components/progress/progress'
import VideoPlayer from './components/video/video'
import ErrorScreen from './components/error/Error'
import Configuration from './components/configuration/configuration'
import Tour from './components/tour/tour'
import Util from './components/utils/util'

// Types

// Stores
import TerminalStore from './store/terminalStore'
import ComponentStore from './store/componentStore'
import StepComponent from './components/steps/steps'

const App = () => {
  const {
    loaded,
    processed,
    ProgressStore,
    isLoadingError,
    loadingErrorObj,
    updateLoadError,

    FileStore,
    CluiStore,
    VideoStore
  } = ComponentStore
  const { isSubmitted } = CluiStore

  const { currentFileExtension, isDisplayable } = FileStore

  const { toDisplay, updateVideoDisplay, url } = VideoStore

  const [isLoading, setLoading] = useState(false)

  const [secondLoad, setSecondLoad] = useState(false)

  useEffect(() => {
    if (isLoading === false) {
      setLoading(true)
      setTimeout(() => {
        loadFFmpeg()
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
      <Router>
        <>
          <main>
            <ErrorScreen errorObj={loadingErrorObj} />
          </main>
          <Footer />
        </>
      </Router>
    )
  }
  return (
    <Router>
      <>
        <div className="overlay-wrapper">
          {!isMobile ? (
            <div className="blur">
              <Util />
              <Tour>
                <>
                  <main>
                    <div className="flex-wrapper">
                      {!isSubmitted ? (
                        <div className="dropzone-wrapper">
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
                      ) : (
                        <div className="terminal-wrapper">
                          <Fade bottom>
                            <TerminalComponent />
                          </Fade>
                        </div>
                      )}
                    </div>
                  </main>
                  <StepComponent />
                  <Header />
                </>
              </Tour>
            </div>
          ) : null}
          {/* @ts-ignore Styled JSX */}
          <style jsx>
            {`
              .overlay-wrapper {
                display: grid;
                grid-template: 1fr / 1fr;
              }
              .overlay-wrapper > * {
                grid-column: 1 / 1;
                grid-row: 1 / 1;
              }
              main {
                max-width: ${isSubmitted ? '80vw' : 'unset'};
                padding-top: ${isSubmitted ? '15vh' : 'unset'};
              }
              ul {
                max-width: unset !important;
                background-color: transparent !important;
              }
            `}
          </style>
        </div>

        <Footer />
      </>
    </Router>
  )
}

export default observer(App)
