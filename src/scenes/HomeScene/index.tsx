import * as React from 'react'
import scene from "../../common/annotations/scene"
import {BaseScene} from "../BaseScene/index"

@scene({
  sceneName: 'HomeScene',
  parentSceneName: null,
  requiredPermissions: [],
  navigationItem: {
    link:       '/home',
    route:      'home',
    showInMenu: false,
    exact:      true
  }
})
export class HomeScene extends BaseScene {

  render() {
    return (
      <header>
        <h1>Welcome home!</h1>
      </header>
    )
  }
}
