import {SceneEntry} from './common/scenes/scenes'
import {TestScene} from './scenes/TestScene'
import {HomeScene} from './scenes/HomeScene'

const SCENE_REGISTRY: SceneEntry[] = [
  new SceneEntry({
    sceneName: 'RootScene',
    sceneComponent: TestScene,
    navigationItemParams: {
      link: '/',
      route: '/'
    },
    permissionCheck: () => true,
    childScenes: [
      new SceneEntry({
        sceneName: 'TestScene',
        sceneComponent: TestScene,
        navigationItemParams: {
          link: '/test',
          route: 'test'
        },
        permissionCheck: () => true
      }),

      new SceneEntry({
        sceneName: 'HomeScene',
        sceneComponent: HomeScene,
        navigationItemParams: {
          link: '/home',
          route: 'home'
        },
        permissionCheck: () => true
      })
    ]
  })
]

export default SCENE_REGISTRY
