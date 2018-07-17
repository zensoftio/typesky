import 'reflect-metadata'
import * as React from "react"
import {BaseScene} from "../../scenes/BaseScene/index"

export const SCENE_METADATA = Symbol('scene_metadata')

export interface NavigationItem {
  link:       string  // Absolute link to use in LinkTo component
  route:      string  // Relative route to the scene
  showInMenu: boolean // Whether to show a menu item for the scene
  className?: string  // Class name for navigation item
  withIcon?:  boolean
  exact?:     boolean
}

export interface SceneMetadata {
  sceneName: string
  parentSceneName: string | null
  requiredPermissions: string[]
  navigationItem: NavigationItem
}

export interface SceneEntry extends SceneMetadata {
  sceneComponent: any
}

class SceneRegistry {

  map: Map<string, SceneEntry> = new Map()

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

  public get rootScenes(): SceneEntry[] {

    let rootScenes: SceneEntry[] = []

    this.forEach((registeredScene) => {

      if (registeredScene.parentSceneName === null) {
        rootScenes.push(registeredScene)
      }
    })

    return rootScenes
  }

  public childScenesFor(component: BaseScene) {

    let metadata = <SceneMetadata[]>Reflect.get(this, SCENE_METADATA) || []

    let currentScene = metadata.find((meta) => {
      return meta.navigationItem.link = component.props.match
    })

    if (!currentScene) { return [] }

    let childScenes: SceneEntry[] =  []

    sceneRegistry.forEach((registeredScene: SceneEntry) => {

      if (currentScene && registeredScene.parentSceneName === currentScene.sceneName) {
        childScenes.push(registeredScene)
      }
    })

    return childScenes
  }
}

// TODO: Think of a way to inject this instance into scenes
export const sceneRegistry: SceneRegistry = new SceneRegistry()


// NOTE: Setting empty array as requiredPermissions will disable access to the route
// NOTE: Multiple scene annotations may be attached to single component (unless names do not conflict)
export const scene = (scene: SceneMetadata) => {

  return (target: Function) => {
    let sceneMetadata = Reflect.get(target, SCENE_METADATA) || []

    sceneMetadata.push(scene)

    Reflect.set(target, SCENE_METADATA, sceneMetadata)
    sceneRegistry.set(scene.sceneName, { ...scene, sceneComponent: target})
  }
}

export default scene
