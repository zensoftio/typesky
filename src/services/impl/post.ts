import {PostService} from '../index'
import {PostStore} from '../../stores/index'
import {injectable, injectOnMethod, injectOnProperty} from '../../common/annotations/common'
import Pathes from '../../dicts/pathes'
import {Fetcher} from '../../fetchers/index'
import BaseService from '../base/base'

@injectable('PostService')
export default class DefaultPostService extends BaseService implements PostService {
  
  private fetcher: Fetcher
  
  constructor(@injectOnProperty('PostStore') private repository: PostStore) {
    super()
  }
  
  @injectOnMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }
  
  async loadPost(postId: number) {
    // prepare result container for async operations
    this.repository.prepare('postById')
    
    // delay execution for showcase
    // await new Promise(resolve => setTimeout(resolve, 1000))
    
    // make response
    const response = await this.fetcher.get(Pathes.Post.byId(postId))
    
    // load results into container
    this.repository.load('postById', response)
  }
  
}
