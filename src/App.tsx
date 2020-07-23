import React from 'react';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { observer } from 'mobx-react';
import './App.css';
import { Loader, Header, Footer } from './components/static/static';
import Dropzone from './components/dropzone/dropzone';
import TerminalComponent from './components/terminal/terminalComponent';
import { ComponentStoreType } from './types/store';
import Clui from './clui/clui';

type AppProps = {
  componentStore: ComponentStoreType,
};
const App: React.FC<AppProps> = ({ componentStore }: AppProps) => {
  const {
    loaded, fileUploaded, updateLoaded, updateFiles,
  } = componentStore;
  // componentStore.loaded = true

  // updateLoaded = updateLoaded.bind(componentStore)
  updateLoaded(true);

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
          {fileUploaded.length === 0
            ? (

              <div className="col dropzone-wrapper">
                <Fade bottom>
                  <Dropzone updateFiles={updateFiles} />
                </Fade>
              </div>

            )
            : (
              <Fade bottom>
                <Clui />
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
