/**
 * Higher Level Component to load FFmpeg and other abstractions
 */
/* global JSX */

import ErrorScreen from '@components/error/Error'
import { Footer } from '@components/static/static'
import { electronWrapper } from '@core/electron'
import processor, { loadFFmpeg } from '@core/processor'
import ComponentStore from '@store/componentStore'
import TerminalStore from '@store/terminalStore'
import appStyles from '@styles/app.module.css'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

const LoadingWrapper = ({
  Component,
  children
}: {
  children?: React.ReactNode
  Component?: () => JSX.Element
}) => {
  const {
    processed,
    loaded,
    isLoadingError,
    loadingErrorObj,
    updateLoaded,
    updateLoadError,
    // Stores
    CluiStore,
    VideoStore,
    FileStore
  } = ComponentStore

  const { toDisplay, updateVideoDisplay } = VideoStore

  const { isDisplayable } = FileStore

  const { isSubmitted } = CluiStore

  const [isLoading, setLoading] = useState(false)

  const [secondLoad, setSecondLoad] = useState(false)

  useEffect(() => {
    if (process.browser) {
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
    } else {
      setLoading(true)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (isSubmitted) {
      processor()
    }
  }, [isSubmitted])

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
    if (process.browser) {
      if (isLoadingError && secondLoad === false) {
        loadFFmpeg()
        setSecondLoad(true)
        updateLoadError(false, new Error())
      }
    }
    // eslint-disable-next-line
  }, [isLoadingError])

  useEffect(() => {
    if (processed) {
      if (!toDisplay) {
        updateVideoDisplay(isDisplayable)
      }
    }
  }, [processed, toDisplay, isDisplayable, updateVideoDisplay])

  if (isLoadingError && secondLoad) {
    return (
      <>
        <div className={appStyles.main}>
          <ErrorScreen errorObj={loadingErrorObj} />
        </div>
        <Footer />
      </>
    )
  }
  if (Component) {
    return <Component></Component>
  }
  if (children) {
    return (
      <>
        <Toaster position="top-right" />

        {children}
      </>
    )
  }
  return null
}

export default observer(LoadingWrapper)
