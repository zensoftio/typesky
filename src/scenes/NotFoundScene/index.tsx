import * as React from 'react';

export namespace NotFoundSceneNS {
  export interface Props {
    /* empty */
  }

  export interface State {
    /* empty */
  }
}

export class NotFoundScene extends React.Component<NotFoundSceneNS.Props, NotFoundSceneNS.State> {

  render() {
    return (
      <header>
        <h1>Not found</h1>
      </header>
    );
  }
}