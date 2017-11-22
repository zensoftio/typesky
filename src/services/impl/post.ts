import {PostService} from '../index'
import {PostStore} from '../../stores/index'
import {injectable, injectOnMethod, injectOnProperty} from '../../common/annotations/common'
import Pathes from '../../dicts/pathes'
import {Fetcher} from '../../fetchers/index'

@injectable('PostService')
export default class DefaultPostService implements PostService {
  
  private fetcher: Fetcher
  
  constructor(@injectOnProperty('PostStore') private repository: PostStore) {
  }
  
  @injectOnMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }
  
  async loadPost(postId: number) {
    // prepare result container for async operations
    this.repository.add('postById')
    
    // delay execution for showcase
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // make response
    const response = await this.fetcher.get(Pathes.Post.byId(postId))
    const post = await response.json()
    
    const allPosts = await fetch(Pathes.Post.all)
    console.log(await allPosts.json())
    
    // load results into container
    this.repository.add('postById', post)
  }
  
}
