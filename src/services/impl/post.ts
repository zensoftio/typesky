import {PostService} from '../index'
import {injectMethod, injectConst, service} from '../../common/annotations/common'
import Pathes from '../../dicts/pathes'
import {Fetcher} from '../../fetchers'
import BaseService from '../../common/services/base/base'
import Post from '../../models/post'
import {PostRecordStorage} from '../../storages'

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
    const response = await this.fetcher.get(Pathes.Post.byId(postId), undefined, Post.Model)
    
    this.store.loadPost(response)
  }
  
}
