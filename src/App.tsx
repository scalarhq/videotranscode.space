
import React from 'react';
import { observer } from "mobx-react"
// import { action } from "mobx"
// import LoaderHandler from "./test"
import './App.css';
import Loader from './components/loader/loader';
import Dropzone from "./components/dropzone/dropzone"
import { ComponentStoreType } from "./types/store"

type AppProps = {
  componentStore: ComponentStoreType;
};
const App: React.FC<AppProps> = ({ componentStore }) => {

  let { loaded, fileUploaded, updateLoaded, updateFiles } = componentStore
  // componentStore.loaded = true

  console.log(fileUploaded)
  // updateLoaded = updateLoaded.bind(componentStore)
  updateLoaded(true)


  if (!loaded) {
    return <Loader />;
  } else {
    return (
      <main>
        <div className="flex-wrapper">
          <div className="col dropzone-wrapper">
            <Dropzone updateFiles={updateFiles} />
          </div>
        </div>
      </main >
    );
  }

};

export default observer(App);
