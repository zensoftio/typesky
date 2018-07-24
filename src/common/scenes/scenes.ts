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
  readonly parentSceneName: string | null
  readonly authorized: boolean
  readonly requiredPermissions: string[]
  readonly navigationItem: NavigationItem
}

export interface SceneMetadataParams {
  sceneName: string,
  sceneComponent: any,
  parentSceneName?: string,
  navigationItem: NavigationItem,
  authorized?: boolean,
  requiredPermissions: string[]
}

export class SceneEntry implements SceneMetadata {

  readonly sceneName: string
  readonly sceneComponent: any
  readonly parentSceneName: string | null
  readonly navigationItem: NavigationItem
  readonly authorized: boolean
  readonly requiredPermissions: string[]

  constructor({
                sceneName,
                sceneComponent,
                parentSceneName = null,
                navigationItem,
                authorized = true,
                requiredPermissions
              }: SceneMetadataParams) {

    this.sceneName = sceneName
    this.sceneComponent = sceneComponent
    this.parentSceneName = parentSceneName || null
    this.navigationItem = navigationItem
    this.authorized = authorized || true
    this.requiredPermissions = requiredPermissions
  }
}
