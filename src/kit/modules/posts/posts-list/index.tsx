import * as React from 'react';
import {ComponentDependencies, withDependencies, WithDependencies} from '../../../../common/hoc/with-dependencies';
import {PostService} from 'Services';
import {PostMapper} from 'Mappers';
import Post from '../../../../models/post';
import {observer} from 'mobx-react';
const styles = require('./index.scss');

interface PostsListDependencies extends ComponentDependencies {
  postService: PostService;
  postMapper: PostMapper;
}

interface PostsListProps extends WithDependencies<PostsListDependencies> {
}

@observer
class PostsList extends React.Component<PostsListProps> {
  componentDidMount(): void {
    this.props.deps.postService.getPosts({_limit: 10});
  }

  render() {
    const data = this.props.deps.postMapper.postList;

    return <div className={styles.post_list_wrapper}>
      {
        data.map((post: Post.PostItem) =>
          <div key={post.id} className={styles.post_list_item}>
            <div className={styles.post_list_item_title}>{post.title}</div>
            <div className={styles.post_list_item_content}>{post.body}</div>
          </div>
        )
      }

    </div>
  }
}

export default withDependencies({postService: 'PostService', postMapper: 'PostMapper'})(PostsList);
