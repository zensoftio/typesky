import {NavigationItem, SceneEntry} from "./common/scenes/scenes"
import {TestScene} from "./scenes/TestScene/index"
import {HomeScene} from "./scenes/HomeScene/index"

const SCENE_REGISTRY: SceneEntry[] = [
  new SceneEntry({
    sceneName: 'RootScene',
    sceneComponent: TestScene,
    navigationItem: new NavigationItem({
      link: '/',
      route: '/'
    }),
    requiredPermissions: []
  }),

  new SceneEntry({
    sceneName: 'TestScene',
    sceneComponent: TestScene,
    navigationItem: new NavigationItem({
      link: '/test',
      route: 'test'
    }),
    requiredPermissions: []
  }),

  new SceneEntry({
    sceneName: 'HomeScene',
    sceneComponent: HomeScene,
    navigationItem: new NavigationItem({
      link: '/home',
      route: 'home'
    }),
    requiredPermissions: []
  })
]

export default SCENE_REGISTRY
