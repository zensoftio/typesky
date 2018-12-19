import * as React from 'react'
import {computed} from 'mobx'
import {SceneRegistryService} from '../../services'
import {SceneEntry} from '../../common/scenes/scenes'
import {Redirect, Route} from 'react-router'
import {AccountMapper} from '../../mappers'
import {observer} from 'mobx-react'
import {injectAware, injectProperty} from '../../common/annotations/dependency-injection'

export interface Match {
  params: any,
  isExact: boolean,
  path: string,
  url: string
}

export interface SceneProps {
  history: History
  location: any
  match: Match
}

@observer
@injectAware
export default class BaseScene<P extends SceneProps = SceneProps> extends React.Component<P, never> {

  @injectProperty('AccountMapper') accountMapper: AccountMapper
  @injectProperty('SceneRegistryService') sceneRegistry: SceneRegistryService

  constructor(props: P) {
    super(props)
  }

  @computed
  protected get allowedChildScenes(): SceneEntry[] {
    const currentUser = this.accountMapper.currentUser

    if (!currentUser) {
      return []
    }

    return this.sceneRegistry.childScenesFor(this).filter(scene => scene.permissionCheck(currentUser))
  }

  @computed
  protected get allowedRoutes() {
    return this.allowedChildScenes.map(scene => {
      return (
        <Route path={scene.navigationItem.link}
               component={scene.component}
               key={scene.name}
               exact={scene.navigationItem.exact}/>
      )
    })
  }

  @computed
  protected get allowedNavigationItems() {
    const navigateableScenes = this.allowedChildScenes.filter(scene => scene.navigationItem.showInMenu)
    return navigateableScenes.map(scene => scene.navigationItem)
  }

  @computed
  protected get defaultRedirect() {
    return this.allowedChildScenes.length > 0 ?
      <Redirect from={this.props.match.path}
                to={this.props.match.url + '/' + this.allowedChildScenes[0].segment}/> : undefined
  }

}
