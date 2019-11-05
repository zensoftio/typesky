import * as React from 'react'
import {RouteConfig, RouteConfigComponentProps} from 'react-router-config'
import {Redirect} from 'react-router'
import {NotFoundScene} from '@Scenes/NotFoundScene'
import {RootScene} from '@Scenes/RootScene'
import {CurrentUser} from '@Entities/auth'

export interface NavigationEntryComponentProps<Params = any> extends RouteConfigComponentProps<Params> {
  route?: NavigationEntry
}

export interface NavigationEntry extends RouteConfig {
  exact?: boolean
  routes?: NavigationEntry[]
  check?: (isLogged: boolean, user?: CurrentUser) => boolean
  component?: React.ComponentType<NavigationEntryComponentProps<any>> | React.ComponentType
}

export const ROUTES: NavigationEntry[] = [
  {
    path: '/',
    exact: true,
    component: RootScene,
    routes: [
      {
        component: () => (
          <React.Fragment>
            Home
          </React.Fragment>
        ),
        path: '/',
        exact: true
      }
    ]
  },
  {
    path: '*',
    component: () => <Redirect to='/'/>
  },
  {
    component: NotFoundScene,
    path: '*'
  }
]
