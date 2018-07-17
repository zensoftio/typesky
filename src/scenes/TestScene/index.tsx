import * as React from 'react'
import './index.css'
import {Link} from 'react-router-dom'
import TodoListView from '../../components/todo-list'
import i18n from '../../common/translate'
import scene from "../../common/annotations/scene"

interface Props {
  history: History
  location: any
  match: any
}

@scene({
  sceneName: 'RootScene',
  parentSceneName: null,
  requiredPermissions: [],
  navigationItem: {
    link:       '/',
    route:      '/',
    showInMenu: false,
    exact:      true
  }
})
@scene({
  sceneName: 'TestScene',
  parentSceneName: null,
  requiredPermissions: [],
  navigationItem: {
    link:       '/test',
    route:      'test',
    showInMenu: false,
    exact:      true
  }
})
export class TestScene extends React.Component<Props, {}> {
  render() {
    return (
      <header>
        <h1>{i18n.t('some.key')}</h1>
        <h1>Hello World</h1>
        <TodoListView/>
        <Link to="/error">Error</Link>
      </header>
    )
  }
}
