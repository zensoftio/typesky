import {RouteConfig, RouteConfigComponentProps} from 'react-router-config';
import {HomeScene} from 'Scenes/HomeScene';
import {TestScene} from 'Scenes/TestScene';
import {NotFoundScene} from 'Scenes/NotFoundScene';
import {RootScene} from 'Scenes/RootScene';
import {PostsScene} from 'Scenes/PostsScene';
import PostsList from 'Modules/posts/posts-list';
import PostAdd from 'Modules/posts/post-add';
import PostDetails from 'Modules/posts/post-details';

export interface NavigationEntryComponentProps<Params = any> extends RouteConfigComponentProps<Params> {
  route?: NavigationEntry
}

export interface NavigationEntry extends RouteConfig {
  component?:
    React.ComponentType<NavigationEntryComponentProps<any>>
    | React.ComponentType<any>
    | React.ComponentClass<any>;
  routes?: NavigationEntry[];
}

export const ROUTES: NavigationEntry[] = [
  {
    component: RootScene,
    routes: [
      {
        path: '/',
        component: HomeScene,
        exact: true
      },
      {
        path: '/posts',
        component: PostsScene,
        routes: [
          {
            path: '/posts',
            component: PostsList,
            exact: true,
          },
          {
            path: '/posts/add',
            component: PostAdd,
          },
          {
            path: '/posts/:id',
            component: PostDetails,
          }
        ]
      },
      {
        path: '**',
        component: NotFoundScene,
      }
    ]
  },

];
