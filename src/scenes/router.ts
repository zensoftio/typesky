import {TestScene} from './TestScene'
import {HomeScene} from './HomeScene'
import scene from "../common/annotations/scene"

export class Router {

  static loadScenes() {

    scene({
      sceneName: 'RootScene',
      parentSceneName: null,
      requiredPermissions: [],
      navigationItem: {
        link: '/',
        route: '/',
        showInMenu: false,
        exact: true
      }
    })(TestScene)

    scene({
      sceneName: 'TestScene',
      parentSceneName: null,
      requiredPermissions: [],
      navigationItem: {
        link: '/test',
        route: 'test',
        showInMenu: false,
        exact: true
      }
    }) (TestScene)

    scene({
      sceneName: 'HomeScene',
      parentSceneName: null,
      requiredPermissions: [],
      navigationItem: {
        link: '/home',
        route: 'home',
        showInMenu: false,
        exact: true
      }
    }) (HomeScene)
  }
}
