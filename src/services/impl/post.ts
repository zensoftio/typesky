import {PostService} from '../index'
import {PostStore} from '../../stores/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'

@injectable('PostService')
export default class DefaultPostService implements PostService {
  constructor(@injectOnProperty('PostStore') private repository: PostStore) {
  }
  
  async loadPost(postId: number) {
    // prepare result container for async operations
    this.repository.add('postById')
    
    // delay execution for showcase
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // make response
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    const post = await response.json()
    
    // load results into container
    this.repository.add('postById', post)
  }
  
}
