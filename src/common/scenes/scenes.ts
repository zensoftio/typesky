import {USER_PERMISSIONS} from '../../misc/permissions'

export interface NavigationItemParams {
  link: string,         // Absolute link to use in LinkTo component
  route: string,        // Relative route to the scene
  showInMenu?: boolean, // Whether to show a menu item for the scene
  className?: string,   // Class name for navigation item
  withIcon?: boolean,
  exact?: boolean
}

export class NavigationItem {
  readonly link: string // Absolute link to use in LinkTo component
  readonly route: string // Relative route to the scene
  readonly showInMenu: boolean // Whether to show a menu item for the scene
  readonly className: string | null // Class name for navigation item
  readonly withIcon: boolean
  readonly exact: boolean

  constructor({
                link,
                route,
                showInMenu = false,
                className = null,
                withIcon = false,
                exact = true
              }: NavigationItemParams) {
    this.link = link
    this.route = route
    this.showInMenu = showInMenu
    this.className = className
    this.withIcon = withIcon
    this.exact = exact
  }
}

export interface SceneMetadata {
  readonly sceneName: string
  readonly childScenes: SceneMetadata[]
  readonly authorized: boolean
  readonly requiredPermissions: USER_PERMISSIONS[]
  readonly navigationItem: NavigationItem
}

export interface SceneMetadataParams {
  sceneName: string,
  sceneComponent: any,
  childScenes?: SceneEntry[],
  navigationItem: NavigationItem,
  authorized?: boolean,
  requiredPermissions: USER_PERMISSIONS[]
}

export class SceneEntry implements SceneMetadata {

  readonly sceneName: string
  readonly sceneComponent: any
  readonly childScenes: SceneEntry[]
  readonly navigationItem: NavigationItem
  readonly authorized: boolean
  readonly requiredPermissions: USER_PERMISSIONS[]

  constructor({
                sceneName,
                sceneComponent,
                childScenes,
                navigationItem,
                authorized = true,
                requiredPermissions
              }: SceneMetadataParams) {

    this.sceneName = sceneName
    this.sceneComponent = sceneComponent
    this.childScenes = childScenes || []
    this.navigationItem = navigationItem
    this.authorized = (authorized === undefined) ? true : authorized
    this.requiredPermissions = requiredPermissions
  }
}
