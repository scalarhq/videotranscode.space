import React from 'react';
import ReactDOM from 'react-dom';

import 'mobx-react/batchingForReactDom';

// import './index.css';
import './tailwind.output.css';
// import App from './App';
import GlobalErrorWrapper from './ErrorWrapper';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <>
    {/* <Provider store={store}> */}
    <GlobalErrorWrapper />
    {/* </Provider> */}
  </>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
