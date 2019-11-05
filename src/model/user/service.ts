import BaseService from '../../common/services/base/base'
import {injectable, injectProperty} from 'type-injector'
import {SYSTEM_LAYERS} from '@App/layers'
import {Fetcher} from '@App/model/fetcher'
import {UserRecordStorage, UserService} from '@App/model/user/index'
import {AuthService} from '@App/model/auth'
import {WithRequestMetadata} from '@Types'
import User from '@Entities/user/user'
import Pathes from '@App/dicts/pathes'
import {UserDTO} from '@Entities/user/userDTO'

@injectable(SYSTEM_LAYERS.user.serviceName)
export default class DefaultUserService extends BaseService implements UserService {

  @injectProperty(SYSTEM_LAYERS.fetcher.serviceName)
  private fetcher: Fetcher

  @injectProperty(SYSTEM_LAYERS.auth.serviceName)
  private authService: AuthService

  @injectProperty(SYSTEM_LAYERS.user.storageName)
  private store: UserRecordStorage

  async getUserInfo(): Promise<void> {
    try {
      const response = await this.fetcher.get<User.UserInfo>(Pathes.User.userInfo, {}, User.UserInfo)
      this.store.set('userInfo', WithRequestMetadata.data<User.UserInfo>(response))
    } catch (e) {
      throw e
    }
  }

  async updateUserInfo(userData: UserDTO.UserUpdateDTO, userId: string): Promise<void> {
    try {
      this.authService.checkUserAuthorised()
      const response = await this.fetcher.put<User.UserInfo>(Pathes.User.userUpdateInfo(userId), userData, User.UserInfo)
      this.store.set('userInfo', WithRequestMetadata.data<User.UserInfo>(response))
    } catch (e) {
      throw e
    }
  }
}
