/* eslint-disable no-nested-ternary */

// Modules
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import processor, { loadFFmpeg } from './ts/processor';

// Styling
import './App.css';

// Router
import Router from './router';

// Components
import { Loader, Header, Footer } from './components/static/static';
import Dropzone from './components/dropzone/dropzone';
import TerminalComponent from './components/terminal/terminalComponent';
import ProgressBar from './components/progress/progress';
import VideoPlayer from './components/video/video';
import ErrorScreen from './components/error/Error';
import Clui from './clui/clui';
import BasicFeatures from './components/basic-features/basicFeature';

// Types
import { ComponentStoreType } from './types/store';

// Stores
import TerminalStore from './store/terminalStore';

type AppProps = {
  componentStore: ComponentStoreType,
};
const App: React.FC<AppProps> = ({ componentStore }: AppProps) => {
  const {
    loaded,
    processed,
    ProgressStore,
    isLoadingError,
    loadingErrorObj,

    FileStore,
    CluiStore,
    VideoStore,
  } = componentStore;
  const { isSubmitted } = CluiStore;

  const { currentFileExtension, files, isDisplayable } = FileStore;

  const { toDisplay, updateVideoDisplay, url } = VideoStore;

  // updateLoaded = updateLoaded.bind(componentStore)
  useEffect(() => {
    loadFFmpeg();
  }, []);

  const [cluiToggle, setCluiToggle] = useState(true);

  useEffect(() => {
    if (isSubmitted) {
      // console.log('Call Processor');
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
  }, [processed]);

  if (!loaded) {
    return (

      <>
        <Router>
          <Loader />
        </Router>
        {' '}
        <Footer />
      </>
    );
  }
  if (isLoadingError) {
    return (

      <>
        <Router>
          <main>
            <Header />
            <ErrorScreen loadingErrorObj={loadingErrorObj} />
          </main>
        </Router>
        <Footer />
      </>

    );
  }
  return (

    <>
      <Router>
        <main>
          <Header />

          <div className="flex-wrapper">
            {!files.uploaded
              ? (

                <div className="col dropzone-wrapper">
                  <Fade bottom>
                    <Dropzone />
                  </Fade>
                </div>

              )
              : !isSubmitted ? (

                <div className="configuration-wrapper">
                  <Fade bottom>
                    {cluiToggle ? <Clui /> : <BasicFeatures />}
                  </Fade>
                  <div className="toggle">
                    <div className="toggle-label">
                      <p>Basic Features</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={cluiToggle}
                        onChange={(e) => {
                          setCluiToggle(!cluiToggle);
                        }}
                      />
                      <span className="toggle-slider round" />
                    </label>
                    <div className="toggle-label">
                      <p>All Features (CLUI)</p>
                    </div>
                  </div>
                  {/* @ts-ignore Styled JSX */}
                  <style jsx>
                    {`
                    .configuration-wrapper {
                      display : flex;
                      flex-direction : column;
                    }
                    .toggle {
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                      align-items: center;
                    }
                    .toggle-label {
                      padding: 0 2%;
                      font-weight: 400;
                    }

                    .switch {
                      position: relative;
                      display: inline-block;
                      width: 60px;
                      height: 34px;
                    }

                    .switch input {
                      opacity: 0;
                      width: 0;
                      height: 0;
                    }

                    .toggle-slider {
                      position: absolute;
                      cursor: pointer;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      background-color: #ccc;
                      -webkit-transition: 0.4s;
                      transition: 0.4s;
                    }

                    .toggle-slider:before {
                      position: absolute;
                      content: '';
                      height: 26px;
                      width: 26px;
                      left: 4px;
                      bottom: 4px;
                      background-color: white;
                      -webkit-transition: 0.4s;
                      transition: 0.4s;
                    }

                    input:checked + .toggle-slider {
                      background-color: #2196f3;
                    }

                    input:focus + .toggle-slider {
                      box-shadow: 0 0 1px #2196f3;
                    }

                    input:checked + .toggle-slider:before {
                      -webkit-transform: translateX(26px);
                      -ms-transform: translateX(26px);
                      transform: translateX(26px);
                    }

                    /* Rounded sliders */
                    .toggle-slider.round {
                      border-radius: 34px;
                    }

                    .toggle-slider.round:before {
                      border-radius: 50%;
                    }
                    `}
                  </style>
                </div>

              ) : !processed ? (
                <Fade bottom>
                  <ProgressBar {...ProgressStore} />
                </Fade>
              )
                  : (
                    <Fade bottom>
                      <VideoPlayer url={url} toDisplay={toDisplay} ext={currentFileExtension} />
                    </Fade>
                  )}

            <div className="terminal-wrapper">
              <Fade bottom>
                <TerminalComponent />
              </Fade>
            </div>
          </div>
        </main>
      </Router>
      <Footer />
    </>

  );
};

export default observer(App);

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
