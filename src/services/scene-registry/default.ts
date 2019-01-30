import 'reflect-metadata'
import {SceneRegistryService} from '../index'
import BaseScene from '../../scenes/BaseScene'
import {SceneEntry} from '../../common/scenes/scenes'
import {service} from '../../common/annotations/dependency-injection'
import BaseService from '../../common/services/base/base'
import SCENE_REGISTRY from '../../scenes'

const SCENE_METADATA = Symbol('scene_metadata')

@service('SceneRegistry')
export default class DefaultSceneRegistryService extends BaseService implements SceneRegistryService {

  postConstructor() {
    this.scenes = SCENE_REGISTRY.map(params => new SceneEntry(params, ''))
    this.registerScenes(this.scenes)

    return Promise.resolve()
  }

  scenes: SceneEntry[] = []

  registerScenes(sceneEntry: SceneEntry[]) {
    sceneEntry.forEach(this.registerScene)
  }

  registerScene = (sceneEntry: SceneEntry) => {
    const sceneMetadata = Reflect.getMetadata(SCENE_METADATA, sceneEntry.component) || []

    sceneMetadata.push(sceneEntry)

    Reflect.set(sceneEntry.component, SCENE_METADATA, sceneMetadata)
    this.registerScenes(sceneEntry.childScenes)
  }

  public rootScenes(): SceneEntry[] {

    return this.scenes
  }

  public childScenesFor(scene: BaseScene<any>) {

    const metadata = Reflect.get(scene.constructor, SCENE_METADATA) as SceneEntry[] || []

    const currentScene = metadata.find((meta) => {
      return meta.match === scene.props.match.path
    })

    if (!currentScene) {
      return []
    }

    return currentScene.childScenes
  }
}
