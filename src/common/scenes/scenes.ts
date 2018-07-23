export class NavigationItem {
  constructor(
    public link: string,          // Absolute link to use in LinkTo component
    public route: string,          // Relative route to the scene
    public showInMenu: boolean = false, // Whether to show a menu item for the scene
    public className?: string,          // Class name for navigation item
    public withIcon?: boolean,
    public exact?: boolean
  ) {

  }
}

export interface SceneMetadata {
  sceneName: string
  parentSceneName: string | null
  authorized: boolean
  requiredPermissions: string[]
  navigationItem: NavigationItem
}

export class SceneEntry implements SceneMetadata {
  constructor(
    public sceneName: string,
    public sceneComponent: any,
    public parentSceneName: string | null = null,
    public navigationItem: NavigationItem,
    public authorized: boolean = true,
    public requiredPermissions: string[]
  ) {

  }
}
