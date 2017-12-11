import {PostService} from '../index'
import {PostStore} from '../../stores'
import {injectable, injectOnMethod, injectOnProperty} from '../../common/annotations/common'
import Pathes from '../../dicts/pathes'
import {Fetcher} from '../../fetchers'
import BaseService from '../base/base'
import Post from '../../models/post'
import {instantiateJson} from '../../common/annotations/model'

@injectable('PostService')
export default class DefaultPostService extends BaseService implements PostService {
  
  private fetcher: Fetcher
  
  constructor(@injectOnProperty('PostStore') private store: PostStore) {
    super()
  }
  
  @injectOnMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }
  
  async loadPost(postId: number) {
    // prepare result container for async operations
    this.store.prepare('postById')
    
    // make response
    const response = await this.fetcher.get(Pathes.Post.byId(postId), undefined, Post.Model)
    
    // load results into container
    this.store.load('postById', instantiateJson(response, Post.Model))
  }
  
}
