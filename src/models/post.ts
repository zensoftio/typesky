import {observable} from 'mobx'
import {attr} from '../common/annotations/model'

namespace Post {
  export class Model {
    @attr()
    @observable
    id: number
    
    @attr()
    @observable
    userId: number
    
    @attr()
    @observable
    title: string
    
    @attr()
    @observable
    body: string
  }
}

export default Post
