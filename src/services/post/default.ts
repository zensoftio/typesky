import {PostService} from '../index';
import Pathes from '../../dicts/pathes';
import {Fetcher} from '../../fetchers';
import BaseService from '../../common/services/base/base';
import Post from '../../models/post';
import {PostRecordStorage} from '../../storages';
import {injectConstructor, injectMethod, service} from '../../common/annotations/dependency-injection';

@service('Post')
export default class DefaultPostService extends BaseService implements PostService {

  private fetcher: Fetcher;

  constructor(@injectConstructor('PostRecordStorage') private store: PostRecordStorage) {
    super()
  }

  @injectMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }

  async getPosts(params?: {_limit: number}) {
    const response = await this.fetcher.get<Array<Post.PostItem>>(Pathes.Posts.posts, params);
    this.store.set('postList', response)
  }

  async getPost(id: string) {
    try {
      const response = await this.fetcher.get<Post.PostItem>(Pathes.Posts.post(id));
      this.store.set('post', response)
    } catch(e) {
    }

  }

  clearPost() {
    this.store.set('post', null);
  }

  async addPost(body: {title: string, body: string, userId: number}) {
    await this.fetcher.post(Pathes.Posts.posts, body);
    this.getPosts();
  }
}
