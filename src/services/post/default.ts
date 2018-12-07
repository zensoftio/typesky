import {PostService} from '../index'
import Pathes from '../../dicts/pathes'
import {Fetcher} from '../../fetchers'
import BaseService from '../../common/services/base/base'
import Post from '../../models/post'
import {PostRecordStorage} from '../../storages'
import {injectConstructor, injectMethod, service} from '../../common/annotations/dependency-injection'

@service('Post')
export default class DefaultPostService extends BaseService implements PostService {

  private fetcher: Fetcher

  constructor(@injectConstructor('PostRecordStorage') private store: PostRecordStorage) {
    super()
  }

  @injectMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }

  async loadPost(postId: number) {
    const post = await this.fetcher.get(Pathes.Post.byId(postId), undefined, Post.Model)

    this.store.set('postById', post)
  }

}
