import {observable} from 'mobx'
import {attr} from '../common/annotations/model'

namespace Post {
  export class PostItem {
    @attr()
    @observable
    id: number;
    
    @attr()
    @observable
    userId: number;
    
    @attr()
    @observable
    title: string;
    
    @attr()
    @observable
    body: string;
  }
  
  export interface Records {
    post: Post.PostItem;
    postList: Array<Post.PostItem>;
  }
}

export default Post;
