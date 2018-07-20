import * as React from 'react'
import {Redirect, Route, Router, Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

import {NotFoundScene} from './scenes/NotFoundScene/index'
import {SceneRegistryService} from "./services/index"
import {instanceRegistry} from "./common/annotations/common"

const history = createBrowserHistory()

export default class App extends React.Component<{}, {}> {

  sceneRegistry: SceneRegistryService = instanceRegistry.get('SceneRegistryService')

  constructor(props: {}, context?: any) {
    super(props, context)
    console.info('react started render')
  }

  render() {

    let routes = this.sceneRegistry.rootScenes().map(scene => {
      return (<Route path={`/${scene.navigationItem.route}`} exact={scene.navigationItem.exact} component={scene.sceneComponent} key={scene.sceneName} />)
    })

    return (
      <Router history={history}>
        <Switch>
          {routes}
          {/*<Route path="/" exact component={TestScene}/>*/}
          <Route path="/error" component={NotFoundScene}/>
          <Redirect from='*' to={'/error'}/>
        </Switch>
      </Router>
    )
  }
}

