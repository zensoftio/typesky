import {Account} from '../../models/account'

export interface NavigationItemParams {
  link: string;         // Absolute link to use in LinkTo component
  route: string;        // Relative route to the scene
  showInMenu?: boolean; // Whether to show a menu item for the scene
  className?: string;   // Class name for navigation item
  withIcon?: boolean;
  exact?: boolean;
  name: string;
}

export class NavigationItem {
  readonly link: string // Absolute link to use in LinkTo component
  readonly route: string // Relative route to the scene
  readonly showInMenu: boolean // Whether to show a menu item for the scene
  readonly className: string | undefined // Class name for navigation item
  readonly withIcon: boolean
  readonly exact: boolean
  readonly name: string

  constructor({
                link,
                route,
                showInMenu = false,
                className,
                withIcon = false,
                exact,
                name
              }: NavigationItemParams) {
    this.link = link
    this.route = route
    this.showInMenu = showInMenu
    this.className = className
    this.withIcon = withIcon
    this.exact = exact || false
    this.name = name
  }
}

type PermissionCheck = (user: Account.CurrentUser) => boolean;

export interface SceneMetadata {
  readonly sceneName: string;
  readonly childScenes: SceneMetadata[];
  readonly authorized: boolean;
  readonly permissionCheck: PermissionCheck;
  readonly navigationItem: NavigationItem;
}

export interface SceneMetadataParams {
  sceneName: string;
  sceneComponent: any;
  childScenes?: SceneEntry[];
  navigationItemParams: {
    link: string;         // Absolute link to use in LinkTo component
    route: string;        // Relative route to the scene
    showInMenu?: boolean; // Whether to show a menu item for the scene
    className?: string;   // Class name for navigation item
    withIcon?: boolean;
    exact?: boolean;
  };
  authorized?: boolean;
  permissionCheck: PermissionCheck;
}

export class SceneEntry implements SceneMetadata {

  readonly sceneName: string
  readonly sceneComponent: any
  readonly childScenes: SceneEntry[]
  readonly navigationItem: NavigationItem
  readonly authorized: boolean
  readonly permissionCheck: PermissionCheck

  constructor({
                sceneName,
                sceneComponent,
                childScenes,
                navigationItemParams,
                authorized = true,
                permissionCheck
              }: SceneMetadataParams) {

    this.sceneName = sceneName
    this.sceneComponent = sceneComponent
    this.childScenes = childScenes || []
    this.navigationItem = new NavigationItem({
      ...navigationItemParams,
      name: sceneName
    })
    this.authorized = (authorized === undefined) ? true : authorized
    this.permissionCheck = permissionCheck
  }
}
