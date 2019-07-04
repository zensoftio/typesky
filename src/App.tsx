import * as React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history'
import {NotFoundScene} from './scenes/NotFoundScene';
import {TestScene} from './scenes/TestScene';
import {HomeScene} from './scenes/HomeScene';

const history = createBrowserHistory();

export default class App extends React.Component<any, any> {

  constructor(props: any, context?: any) {
    super(props, context);
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={TestScene}/>
          <Route path="/home" exact component={HomeScene}/>
          <Route path="**" component={NotFoundScene}/>
        </Switch>
      </Router>
    )
  }
}

