import * as React from 'react';
import {observer} from 'mobx-react';
import BaseScene from '../BaseScene';
import {renderRoutes} from 'react-router-config';
import {Link} from 'react-router-dom';
const styles = require('./index.scss');

@observer
export class PostsScene extends BaseScene {
  render() {
    return <div className={styles.posts_scene_wrapper}>
      <aside>
        <Link to='/' className={styles.posts_scene_logo} />
        <nav>
          <Link className={styles.posts_scene_nav_link} to='/'>Home</Link>
          <Link className={styles.posts_scene_nav_link} to='/posts'>Posts</Link>
          <Link className={styles.posts_scene_nav_link} to='/posts/add'>Add post</Link>
        </nav>
      </aside>
      <main>
        {renderRoutes(this.allowedRoutes)}
      </main>
    </div>;
  }
}
