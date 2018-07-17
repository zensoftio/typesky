import * as React from 'react'
import scene from "../../common/annotations/scene"

interface Props {
  history: History
  location: any
  match: any
}

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
export class HomeScene extends React.Component<Props, {}> {

  render() {
    return (
      <header>
        <h1>Welcome home!</h1>
      </header>
    )
  }
}
