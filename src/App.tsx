import * as React from 'react'
import {Route, Router, Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

import {NotFoundScene} from './scenes/NotFoundScene/index'
import {TestScene} from './scenes/TestScene/index'

const history = createBrowserHistory()

export interface Props {
  /* empty */
}

export interface State {
  /* empty */
}

export default class App extends React.Component<Props, State> {
  
  constructor(props: Props, context?: any) {
    super(props, context)
    console.log('react started render')
  }
  
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

