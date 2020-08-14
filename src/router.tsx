import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AboutPage from './components/static/about';

const Router = ({ children }: { children: JSX.Element }) => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/docs"
        component={() => {
          window.location.href = 'https://docs.videotranscode.space/';
          return null;
        }}
      />
      <Route exact path="/about" component={AboutPage} />
      <Route path="/">{children}</Route>
    </Switch>
  </BrowserRouter>
);

export default Router;
