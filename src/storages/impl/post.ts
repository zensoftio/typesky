import {PostRecordStorage} from '../index'
import Post from '../../models/post'
import DefaultRecordStorage from '../../common/storages/base/default'
import {injectable} from '../../common/annotations/common'
import {instantiateJson} from '../../common/annotations/model'
import {action} from 'mobx'

@injectable('PostRecordStorage')
export default class DefaultPostRecordStorage extends DefaultRecordStorage<Post.Records> implements PostRecordStorage {
  
  @action
  loadPost(postJson: any): this {
    this.set('postById', instantiateJson<Post.Model>(postJson, Post.Model))
    return this
  }
  
}
