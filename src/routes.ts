import {RouteConfig, RouteConfigComponentProps} from 'react-router-config';
import {HomeScene} from 'Scenes/HomeScene';
import {TestScene} from 'Scenes/TestScene';
import {NotFoundScene} from 'Scenes/NotFoundScene';
import {RootScene} from 'Scenes/RootScene';

export interface NavigationEntryComponentProps<Params = any> extends RouteConfigComponentProps<Params> {
  route?: NavigationEntry
}

export interface NavigationEntry extends RouteConfig {
  component?: React.ComponentType<NavigationEntryComponentProps<any>> | React.ComponentType;
  routes?: NavigationEntry[];
}

export const ROUTES: NavigationEntry[] = [
  {
    path: '',
    component: RootScene,
    routes: [
      {
        path: '/',
        component: TestScene,
        exact: true
      },
      {
        path: '/home',
        component: HomeScene,
        exact: true
      },
      {
        path: '/test',
        component: TestScene,
        exact: true
      },
      {
        path: '**',
        component: NotFoundScene,
      }
    ]
  },

];
