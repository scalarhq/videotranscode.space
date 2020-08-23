/* eslint-disable no-nested-ternary */

// Modules
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { Fade } from 'react-reveal';
import processor, { loadFFmpeg } from './ts/processor';

// Styling
import './App.css';

// Router
import Router from './router';

// Components
import { Header, Footer } from './components/static/static';
import Dropzone from './components/dropzone/dropzone';
import TerminalComponent from './components/terminal/terminalComponent';
import ProgressBar from './components/progress/progress';
import VideoPlayer from './components/video/video';
import ErrorScreen from './components/error/Error';
import Configuration from './components/configuration/configuration';

// Types

// Stores
import TerminalStore from './store/terminalStore';
import ComponentStore from './store/componentStore';

const App = () => {
  const {
    loaded,
    processed,
    ProgressStore,
    isLoadingError,
    loadingErrorObj,

    FileStore,
    CluiStore,
    VideoStore,
  } = ComponentStore;
  const { isSubmitted } = CluiStore;

  const {
    currentFileExtension, isDisplayable,
  } = FileStore;

  const { toDisplay, updateVideoDisplay, url } = VideoStore;

  useEffect(() => {
    loadFFmpeg();
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      processor();
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (processed) {
      console.info('Current Video State | Default Video State', toDisplay, isDisplayable);
      if (!toDisplay) {
        updateVideoDisplay(isDisplayable);
      }
    }
  }, [processed, toDisplay, isDisplayable, updateVideoDisplay]);

  useEffect(() => {
    if (loaded) {
      const { updateTerminalText } = TerminalStore;
      /**
      * Overriding Console for Terminal
      *
      */
      const newConsole = (oldConsole: typeof window.console) => ({
        ...oldConsole,
        log(text: any) {
          oldConsole.log(text);
          if (updateTerminalText) { updateTerminalText(text); }
        },
      });

      window.console = newConsole(window.console);
    }
  }, [loaded]);

  if (isLoadingError) {
    return (

      <Router>
        <>
          <main>
            <Header />
            <ErrorScreen loadingErrorObj={loadingErrorObj} />
          </main>
          <Footer />
        </>

      </Router>

    );
  }
  return (

    <Router>
      <>
        <main>
          <Header />

          <div className="flex-wrapper">
            {!isSubmitted
              ? (

                <div className="col dropzone-wrapper">
                  <Fade bottom>
                    <Dropzone />
                  </Fade>
                </div>

              )
              : !processed ? (
                <Fade bottom>
                  <ProgressBar {...ProgressStore} />
                </Fade>
              )
                : (
                  <Fade bottom>
                    <VideoPlayer url={url} toDisplay={toDisplay} ext={currentFileExtension} />
                  </Fade>
                )}

            {!isSubmitted ? (
              <Configuration />

            )
              : (
                <div className="terminal-wrapper">
                  <Fade bottom>
                    <TerminalComponent />
                  </Fade>
                </div>
              )}

          </div>
        </main>

        <Footer />
      </>
    </Router>

  );
};

export default observer(App);
