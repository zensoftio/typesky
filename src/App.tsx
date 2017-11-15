import * as React from 'react';
import {Switch, Route, Router} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import {NotFoundScene} from "./scenes/NotFoundScene/index";
import {TestScene} from './scenes/TestScene/index'

const history = createBrowserHistory();

export namespace App {
  export interface Props {
    /* empty */
  }

  export interface State {
    /* empty */
  }
}

export default class App extends React.Component<App.Props, App.State> {

  render() {
    return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={TestScene}/>
        <Route path="/error" component={NotFoundScene}/>
      </Switch>
    </Router>
    )
  }
}

