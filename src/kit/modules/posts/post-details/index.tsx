import * as React from 'react';
import {ComponentDependencies, withDependencies, WithDependencies} from '../../../../common/hoc/with-dependencies';
import {PostMapper} from 'Mappers';
import {PostService} from 'Services';
import {match} from 'react-router';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';

const styles = require('./index.scss');

interface PostDetailsDependencies extends ComponentDependencies {
  postMapper: PostMapper;
  postService: PostService;
}

interface PostDetailsProps extends WithDependencies<PostDetailsDependencies> {
  match: match<{ id: string }>;
}

@observer
class PostDetails extends React.Component<PostDetailsProps> {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.deps.postService.getPost(id);
  }

  componentWillUnmount(): void {
  }

  render() {
    const data = this.props.deps.postMapper.post;

    if (!data) {
      return null;
    }

    return <div className={styles.post_details_wrapper}>
      <h1 className={styles.post_details_title}>{data.title}</h1>
      <div className={styles.post_details_content}>{data.body}</div>
      <Link to={'/posts'} className={styles.post_details_back}>&lsaquo; Back</Link>
    </div>;
  }
}

export default withDependencies({ postMapper: 'PostMapper', postService: 'PostService' })(PostDetails);
