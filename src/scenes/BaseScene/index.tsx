import * as React from 'react'
import {computed} from 'mobx'
import {instanceRegistry} from '../../common/annotations/common'
import {SceneRegistryService} from '../../services'
import {SceneEntry} from '../../common/scenes/scenes'
import {Redirect, Route} from 'react-router'
import {AccountMapper} from '../../mappers'
import {observer} from 'mobx-react'

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
export default class BaseScene<P extends SceneProps = SceneProps> extends React.Component<P, never> {

  protected accountMapper: AccountMapper = instanceRegistry.get('AccountMapper')
  protected sceneRegistry: SceneRegistryService = instanceRegistry.get('SceneRegistryService')

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
               component={scene.sceneComponent}
               key={scene.sceneName}
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
    return this.allowedNavigationItems.length > 0 ?
      <Redirect from={this.props.match.path} to={this.allowedNavigationItems[0].link}/> : undefined
  }

}
