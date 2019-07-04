import {SceneParams} from './common/scenes/scenes';
import {TestScene} from './scenes/TestScene';
import {HomeScene} from './scenes/HomeScene';

const SCENE_REGISTRY: SceneParams[] = [
  {
    name: 'RootScene',
    component: TestScene,
    segment: '',
    permissionCheck: () => true,
    childScenes: [
      {
        name: 'TestScene',
        component: TestScene,
        segment: 'test',
        permissionCheck: () => true
      },

      {
        name: 'HomeScene',
        component: HomeScene,
        segment: 'home',
        permissionCheck: () => true
      }
    ]
  }
];

export default SCENE_REGISTRY
