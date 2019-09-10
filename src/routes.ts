import {RouteConfig, RouteConfigComponentProps} from 'react-router-config';
import {HomeScene} from 'Scenes/HomeScene';
import {TestScene} from 'Scenes/TestScene';
import {NotFoundScene} from 'Scenes/NotFoundScene';
import {RootScene} from 'Scenes/RootScene';
import {PostsScene} from 'Scenes/PostsScene';

export interface NavigationEntryComponentProps<Params = any> extends RouteConfigComponentProps<Params> {
  route?: NavigationEntry
}

export interface NavigationEntry extends RouteConfig {
  component?: React.ComponentType<NavigationEntryComponentProps<any>> | React.ComponentType;
  routes?: NavigationEntry[];
}

export const ROUTES: NavigationEntry[] = [
  {
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
        path: '/posts',
        component: PostsScene,
        exact: true,
        routes: [
          {
            path: '/posts/add',
            component: HomeScene,
          },
          {
            path: '/posts/:id',
            // component: PostDetailsScene,
          }
        ]
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
