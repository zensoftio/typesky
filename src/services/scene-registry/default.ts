import 'reflect-metadata'
import {SceneRegistryService} from '../index'
import {service} from '../../common/annotations/common'
import BaseService from '../../common/services/base/base'
import {BaseScene} from "../../scenes/BaseScene/index"
import {SceneMetadata, SceneEntry, NavigationItem} from "../../common/scenes/scenes"
import SCENE_REGISTRY from "../../scenes"

const SCENE_METADATA = Symbol('scene_metadata')

@service('SceneRegistry')
export default class DefaultSceneRegistryService extends BaseService implements SceneRegistryService {

  postConstructor() {
    this.registerScenes(SCENE_REGISTRY)

    return Promise.resolve()
  }

  map: Map<string, SceneEntry> = new Map()

  registerScenes(sceneEntry: SceneEntry[]) {
    sceneEntry.forEach(this.registerScene)
  }

  registerScene = (sceneEntry: SceneEntry) => {
    const sceneMetadata = Reflect.getMetadata(SCENE_METADATA, sceneEntry.sceneComponent) || []

    sceneMetadata.push(sceneEntry)

    Reflect.set(sceneEntry.sceneComponent, SCENE_METADATA, sceneMetadata)
    this.map.set(sceneEntry.sceneName, sceneEntry)
  }

  get(key: string) {
    const value = this.map.get(key)

    if (!value) {
      throw new Error(`There is no scene for ${key}!`)
    }

    return value
  }

  set(key: string, value: SceneEntry) {
    if (this.map.has(key)) {
      throw new Error(`Duplicate scene for ${key}`)
    }

    this.map.set(key, value)
  }

  public forEach(callbackFn: (value: SceneEntry, key: string, map: Map<string, SceneEntry>) => void, thisArg?: any) {
    this.map.forEach(callbackFn, thisArg)
  }

  public rootScenes(): SceneEntry[] {

    const rootScenes: SceneEntry[] = []

    this.forEach((registeredScene) => {

      if (registeredScene.parentSceneName === null) {
        rootScenes.push(registeredScene)
      }
    })

    return rootScenes
  }

  public childScenesFor(scene: BaseScene) {

    const metadata = <SceneMetadata[]>Reflect.get(scene.constructor, SCENE_METADATA) || []

    const currentScene = metadata.find((meta) => {
      return meta.navigationItem.link === scene.props.match.url
    })

    if (!currentScene) {
      return []
    }

    const childScenes: SceneEntry[] = []

    this.forEach((registeredScene: SceneEntry) => {

      if (currentScene && registeredScene.parentSceneName === currentScene.sceneName) {
        childScenes.push(registeredScene)
      }
    })

    return childScenes
  }

}
