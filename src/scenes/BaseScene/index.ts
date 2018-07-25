import * as React from 'react'

export interface Match {
  params: any,
  isExact: boolean,
  path: string,
  url: string
}

export interface SceneProps {
  history: History
  location: any
  match: Match
}

export class BaseScene extends React.Component<SceneProps, {}> {

}
