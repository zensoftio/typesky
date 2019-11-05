import * as React from 'react'
import {observer} from 'mobx-react'
import BaseScene from '../BaseScene/index'
import {renderRoutes} from 'react-router-config'

@observer
export class RootScene extends BaseScene {
  render() {
    // if (!currentUser) {
    //   this.props.history.push('/login')
    // }

    return <React.Fragment>{renderRoutes(this.allowedRoutes)}</React.Fragment>
  }
}
