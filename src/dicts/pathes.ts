import {configuration} from '../configs/index'

const base = (rest: string) => `${configuration.remoteApi}/${rest}`

export default class Pathes {
  static Post = class {
    static byId = (postId: number) => base(`posts/${postId}`)
    static all = base('posts')
  }
}