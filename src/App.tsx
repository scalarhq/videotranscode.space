/* eslint-disable no-nested-ternary */

// Modules
// Styling
import './App.css'

import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Fade } from 'react-reveal'

import Banner from './components/banner/banner'
import Configuration from './components/configuration/configuration'
import Dropzone from './components/dropzone/dropzone'
import ErrorScreen from './components/error/Error'
import ProgressBar from './components/progress/progress'
// Components
import { Footer, Header } from './components/static/static'
import StepComponent from './components/steps/steps'
import TerminalComponent from './components/terminal/terminalComponent'
import Tour from './components/tour/tour'
import Util from './components/utils/util'
import VideoPlayer from './components/video/video'
// Router
import Router from './router'
import ComponentStore from './store/componentStore'
// Types
// Stores
import TerminalStore from './store/terminalStore'
import { useActiveUsers } from './store/userStore'
import processor, { loadFFmpeg } from './ts/processor'

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
        <div className="overlay-wrapper h-screen max-w-screen-xl w-screen">
          {!isMobile ? (
            <div className="blur">
              <Banner />
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
                      ) : cluiToggle ? (
                        <div className="terminal-wrapper">
                          <Fade bottom>
                            <TerminalComponent />
                          </Fade>
                        </div>
                      ) : processed ? (
                        <div className="terminal-wrapper">
                          <Fade bottom>
                            <TerminalComponent />
                          </Fade>
                        </div>
                      ) : null}
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
              .flex-wrapper {
                padding-top: ${isActiveUser ? '2vh' : '5vh'};
              }

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
                padding-top: ${isSubmitted ? '5vh' : 'unset'};
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
