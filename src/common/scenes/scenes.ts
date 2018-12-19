import {Account} from '../../models/account'

export interface NavigationItemParams {
  link: string;         // Absolute link to use in LinkTo component
  showInMenu?: boolean; // Whether to show a menu item for the scene
  className?: string;   // Class name for navigation item
  withIcon?: boolean;
  exact?: boolean;
  name: string;
}

export class NavigationItem {
  readonly link: string // Absolute link to use in LinkTo component
  readonly showInMenu: boolean // Whether to show a menu item for the scene
  readonly className: string | undefined // Class name for navigation item
  readonly withIcon: boolean
  readonly exact: boolean
  readonly name: string

  constructor({
                link,
                showInMenu = false,
                className,
                withIcon = false,
                exact,
                name
              }: NavigationItemParams) {
    this.link = link
    this.showInMenu = showInMenu
    this.className = className
    this.withIcon = withIcon
    this.exact = exact || false
    this.name = name
  }
}

type PermissionCheck = (user: Account.CurrentUser) => boolean;

export interface SceneParams {
  name: string; // Unique name of the scene
  segment: string; // Corresponding URL segment
  component: any; // Scene component class
  childScenes?: SceneParams[];
  permissionCheck?: PermissionCheck;
  showInMenu?: boolean; // Whether to show a menu item for the scene
  className?: string;   // Class name for navigation item
  withIcon?: boolean;
}

export class SceneEntry {

  readonly name: string
  readonly match: string
  readonly segment: string
  readonly component: any
  readonly childScenes: SceneEntry[]
  readonly permissionCheck: PermissionCheck
  readonly navigationItem: NavigationItem

  constructor({
                name,
                segment,
                component,
                childScenes,
                permissionCheck,
                showInMenu,
                className,
                withIcon
              }: SceneParams,
              match: string) {

    this.name = name
    this.match = match
    this.segment = segment
    this.component = component
    this.childScenes = (childScenes || []).map(params => new SceneEntry(params, match + '/' + segment))
    this.permissionCheck = permissionCheck || (() => true)

    this.navigationItem = new NavigationItem({
      link: match,
      showInMenu: showInMenu,
      className: className,
      withIcon: withIcon,
      // TODO: Check if exact routes with children are needed
      exact: !(childScenes && childScenes.length > 0),
      name: name
    })
  }
}
