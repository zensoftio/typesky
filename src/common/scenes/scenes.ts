export class NavigationItem {
  link:       string          // Absolute link to use in LinkTo component
  route:      string          // Relative route to the scene
  showInMenu: boolean = false // Whether to show a menu item for the scene
  className?: string          // Class name for navigation item
  withIcon?:  boolean
  exact?:     boolean
}

export class SceneMetadata {
  sceneName: string
  parentSceneName: string | null = null
  requiredPermissions: string[]
  navigationItem: NavigationItem
}

export class SceneEntry extends SceneMetadata {
  sceneComponent: any
}
