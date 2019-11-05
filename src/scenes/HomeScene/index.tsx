import * as React from 'react'
import BaseScene from '../BaseScene'
import {Link} from 'react-router-dom';

const styles = require('./index.scss');

export class HomeScene extends BaseScene {

  render() {
    return (
      <div className={styles.home_scene_wrapper}>
        <header>
          <h1>Welcome home!</h1>
          <Link to='/posts'>Posts page</Link>
        </header>
      </div>
    )
  }
}
