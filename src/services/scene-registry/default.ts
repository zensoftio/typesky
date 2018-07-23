import 'reflect-metadata'
import {SceneRegistryService} from '../index'
import {service} from '../../common/annotations/common'
import BaseService from '../../common/services/base/base'
import {BaseScene} from "../../scenes/BaseScene/index"
import {SceneMetadata, SceneEntry, NavigationItem} from "../../common/scenes/scenes"
import {HomeScene} from "../../scenes/HomeScene/index"
import {TestScene} from "../../scenes/TestScene/index"

const SCENE_METADATA = Symbol('scene_metadata')

const SCENE_REGISTRY: SceneEntry[] = [
  new SceneEntry(
    'RootScene',
    TestScene,
    null,
    new NavigationItem(
      '/',
      '/'),
    false,
    []),

  new SceneEntry('TestScene',
    TestScene,
    null,
    new NavigationItem(
      '/test',
      'test'),
    false,
    []),

  new SceneEntry('HomeScene',
    HomeScene,
    null,
    new NavigationItem(
      '/home',
      'home'),
    false,
    [])
]

@service('SceneRegistry')
export default class DefaultSceneRegistryService extends BaseService implements SceneRegistryService {

  constructor() {
    super()

    this.registerScenes(SCENE_REGISTRY)
  }

  map: Map<string, SceneEntry> = new Map()

  registerScenes(sceneEntry: SceneEntry[]) {
    sceneEntry.forEach(this.registerScene)
  }

  registerScene = (sceneEntry: SceneEntry) => {
    let sceneMetadata = Reflect.getMetadata(SCENE_METADATA, sceneEntry.sceneComponent) || []

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

    let rootScenes: SceneEntry[] = []

    this.forEach((registeredScene) => {

      if (registeredScene.parentSceneName === null) {
        rootScenes.push(registeredScene)
      }
    })

    return rootScenes
  }

  public childScenesFor(scene: BaseScene) {

    let metadata = <SceneMetadata[]>Reflect.get(this, SCENE_METADATA) || []

    let currentScene = metadata.find((meta) => {
      return meta.navigationItem.link = scene.props.match
    })

    if (!currentScene) {
      return []
    }

    let childScenes: SceneEntry[] = []

    this.forEach((registeredScene: SceneEntry) => {

      if (currentScene && registeredScene.parentSceneName === currentScene.sceneName) {
        childScenes.push(registeredScene)
      }
    })

    return childScenes
  }

}
