import React from 'react';
import { observer } from 'mobx-react';
import './App.css';
import { Loader, Header, Footer } from './components/static/static';
import Dropzone from './components/dropzone/dropzone';
import TerminalComponent from './components/terminal/terminalComponent';
import { ComponentStoreType } from './types/store';

type AppProps = {
  componentStore: ComponentStoreType,
};
const App: React.FC<AppProps> = ({ componentStore }: AppProps) => {
  const { loaded, fileUploaded, updateLoaded, updateFiles } = componentStore;
  // componentStore.loaded = true

  console.log(fileUploaded);
  // updateLoaded = updateLoaded.bind(componentStore)
  updateLoaded(true);

  if (!loaded) {
    return (
      <>
        <Loader /> <Footer />
      </>
    );
  }
  return (
    <>
      <main>
        <Header />
        <div className="flex-wrapper">
          <div className="col dropzone-wrapper">
            <Dropzone updateFiles={updateFiles} />
          </div>

          <div className="terminal-wrapper">
            <TerminalComponent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default observer(App);
