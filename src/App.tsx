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
import { ComponentStoreType } from './types/store';
import Clui from './clui/clui';

type AppProps = {
  componentStore: ComponentStoreType,
};
const App: React.FC<AppProps> = ({ componentStore }: AppProps) => {
  const {
    loaded, processed, files, CluiStore, VideoStore, ProgressStore, currentFileExtension,
  } = componentStore;
  const { isSubmitted } = CluiStore;

  const { toDisplay, url } = VideoStore;

  // updateLoaded = updateLoaded.bind(componentStore)
  loadFFmpeg();

  // const [processing, updateProcessing] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      console.log('Call Processor');
      processor();
    }
  }, [isSubmitted]);

  if (!loaded) {
    return (
      <>
        <Loader />
        {' '}
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
