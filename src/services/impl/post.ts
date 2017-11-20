import {PostService} from '../index'
import {PostRepository} from '../../repositories/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'

@injectable('PostService')
export default class DefaultPostService implements PostService {
  constructor(@injectOnProperty('PostRepository') private repository: PostRepository) {
  }
  
  async loadPost(postId: number) {
    // prepare result container
    const resultSet = this.repository.add('postById')
    
    // delay execution for showcase
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // make response
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    const post = await response.json()
    
    // load results into container
    resultSet.loadResult(post)
  }
  
}
