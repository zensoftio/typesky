import * as React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

export namespace TestSceneNS {
  export interface Props {
    history: any,
    location: any,
    match: any
  }
  export interface State {
    /* empty */
  }
}
export class TestScene extends React.Component<TestSceneNS.Props, TestSceneNS.State> {

  render() {
    return (
      <header>
        <h1>Hello World</h1>
        <Link to="/error">Error</Link>
      </header>
    );
  }
}
