import * as React from 'react';
import {observer} from 'mobx-react';
import BaseScene from '../BaseScene';
import {renderRoutes} from 'react-router-config';
import {NavLink} from 'react-router-dom';
const styles = require('./index.scss');

@observer
export class PostsScene extends BaseScene {
  render() {
    return <div className={styles.posts_scene_wrapper}>
      <aside>
        <nav>
          <NavLink activeClassName={styles.posts_scene_nav_link__active} className={styles.posts_scene_nav_link} to='/home'>Home</NavLink>
          <NavLink activeClassName={styles.posts_scene_nav_link__active} className={styles.posts_scene_nav_link} to='/posts'>Posts</NavLink>
          <NavLink activeClassName={styles.posts_scene_nav_link__active} className={styles.posts_scene_nav_link} to='/posts/add'>Add post</NavLink>
        </nav>
      </aside>
      <main>
        {renderRoutes(this.allowedRoutes)}
      </main>
    </div>;
  }
}
