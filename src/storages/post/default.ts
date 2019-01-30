import {PostRecordStorage} from '../index'
import Post from '../../models/post'
import DefaultRecordStorage from '../../common/storages/base/default'
import {storage} from '../../common/annotations/dependency-injection'

@storage('Post')
export default class DefaultPostRecordStorage extends DefaultRecordStorage<Post.Records> implements PostRecordStorage {

}
