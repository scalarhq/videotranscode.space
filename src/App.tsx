/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';

// @ts-ignore
import Fade from 'react-reveal/Fade';
import { observer } from 'mobx-react';
import processor, { loadFFmpeg } from './ts/processor';
import './App.css';
import { Loader, Header, Footer } from './components/static/static';
import Dropzone from './components/dropzone/dropzone';
import TerminalComponent from './components/terminal/terminalComponent';
import ProgressBar from './components/progress/progress';
import VideoPlayer from './components/video/video';
import ErrorScreen from './components/error/Error';
import { ComponentStoreType } from './types/store';
import Clui from './clui/clui';

type AppProps = {
  componentStore: ComponentStoreType,
};
const App: React.FC<AppProps> = ({ componentStore }: AppProps) => {
  const {
    loaded, processed, FileStore, CluiStore, VideoStore, ProgressStore, isLoadingError, loadingErrorObj,
  } = componentStore;
  const { isSubmitted } = CluiStore;

  const { currentFileExtension, files, isDisplayable } = FileStore;

  const { toDisplay, updateVideoDisplay, url } = VideoStore;

  // updateLoaded = updateLoaded.bind(componentStore)
  useEffect(() => {
    loadFFmpeg();
  }, []);

  // const [processing, updateProcessing] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      console.log('Call Processor');
      processor();
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (processed) {
      console.log('Current Video State | Default Video State', toDisplay, isDisplayable);
      if (!toDisplay) {
        updateVideoDisplay(isDisplayable);
      }
    }
  }, [processed]);

  if (!loaded) {
    return (
      <>
        <Loader />
        {' '}
        <Footer />
      </>
    );
  }
  if (isLoadingError) {
    return (
      <>
        <main>
          <Header />
          <ErrorScreen loadingErrorObj={loadingErrorObj} />
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
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

              <Fade bottom>
                <Clui />
              </Fade>

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
      <Footer />
    </>
  );
};

export default observer(App);
