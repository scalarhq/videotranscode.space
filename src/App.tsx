import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Loader from "./components/loader"

function App() {
	const [loaded, setLoaded] = useState(false)
  if (loaded) {
		return <Loader/>
	} else {
		return (<main> </main>)
	}
}

export default App;
