import ComponentStore from './store/componentStore';
import React, { useEffect } from 'react';
import { observer } from "mobx-react"
// import { action } from "mobx"
// import LoaderHandler from "./test"
import './App.css';
import Loader from './components/loader/loader';

type AppProps = {
  componentStore: typeof ComponentStore;
};
const App: React.FC<AppProps> = ({ componentStore }) => {

  let { loaded, updateLoaded } = componentStore
  // componentStore.loaded = true

  componentStore.updateLoaded(true)


  if (!loaded) {
    return <Loader />;
  } else {
    return <h1>Hi</h1>;
  }

};

export default observer(App);
