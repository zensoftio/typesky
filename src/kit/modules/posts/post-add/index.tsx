import * as React from 'react';
import {ComponentDependencies, withDependencies, WithDependencies} from '../../../../common/hoc/with-dependencies';
import {PostService} from 'Services';
import {PostMapper} from 'Mappers';
import {observer} from 'mobx-react';
import {action, observable, runInAction} from 'mobx';
const styles = require('./index.scss');

interface PostAddDependencies extends ComponentDependencies {
  postService: PostService;
  postMapper: PostMapper;
}

interface PostAddProps extends WithDependencies<PostAddDependencies> {
}

@observer
class PostAdd extends React.Component<PostAddProps> {
  @observable title: string;
  @observable body: string;

  @action
  addPost = () => {
    this.props.deps.postService.addPost({title: this.title, body: this.body, userId: 1});
    this.title = '';
    this.body = '';
  };

  render() {
    return <div className={styles.post_add_wrapper}>
      <form>
        <input
          onChange={(e) => runInAction(() => this.title = e.target.value)}
          value={this.title}
          name="title"
          type="text"
          placeholder="Title"
        />
        <textarea
          onChange={(e) => runInAction(() => this.body = e.target.value)}
          value={this.body}
          name="body"
          cols={30}
          rows={5}
          placeholder="Body" />
        <button onClick={this.addPost} type="button">Submit</button>
      </form>
    </div>
  }
}

export default withDependencies({postService: 'PostService', postMapper: 'PostMapper'})(PostAdd);
