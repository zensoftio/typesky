import {PostService} from '../index'
import {injectConst, injectMethod, service} from '../../common/annotations/common'
import {Fetcher} from '../../fetchers'
import BaseService from '../../common/services/base/base'
import Post from '../../models/post'
import {PostRecordStorage} from '../../storages'
import {instantiateJson} from '../../common/annotations/model'

@service
export default class DefaultPostService extends BaseService implements PostService {
  
  private fetcher: Fetcher
  
  constructor(@injectConst('PostRecordStorage') private store: PostRecordStorage) {
    super()
  }
  
  @injectMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }
  
  async loadPost(postId: number) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // make response
    const post = instantiateJson<Post.Model>({
                                               'userId': postId,
                                               'id': 4,
                                               'title': 'eum et est occaecati',
                                               'body': 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit'
                                             }, Post.Model)
    
    this.store.set('postById', post)
  }
  
}
