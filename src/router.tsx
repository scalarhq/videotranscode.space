/* global JSX */
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

const Router = ({ children }: { children: JSX.Element }) => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/docs"
        component={() => {
          window.location.href = 'https://docs.modfy.video/'
          return null
        }}
      />

      <Route path="/">{children}</Route>
    </Switch>
  </BrowserRouter>
)

export default Router
