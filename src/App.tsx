import * as React from 'react'
import {Route, Router, Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

import {NotFoundScene} from './scenes/NotFoundScene'
import {TestScene} from './scenes/TestScene'

const history = createBrowserHistory()

export default class App extends React.Component<any, any> {

  constructor(props: any, context?: any) {
    super(props, context)
    console.info('react started render')
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

