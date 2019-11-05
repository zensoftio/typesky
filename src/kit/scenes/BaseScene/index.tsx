import * as React from 'react'
import {computed} from 'mobx'
import {match} from 'react-router'
import {History, Location} from 'history'
import {observer} from 'mobx-react'
import {NavigationEntry, NavigationEntryComponentProps} from '@App/routes'

export interface SceneProps extends NavigationEntryComponentProps {
  history: History
  location: Location<any>
  match: match<any>
}

@observer
export default class BaseScene<P extends SceneProps = SceneProps> extends React.Component<P, never> {
  @computed
  get allowedRoutes(): NavigationEntry[] {
    const route = this.props.route
    return route && route.routes || []
  }

  render() {
    return <div>{this.props.match.url}</div>
  }
}
