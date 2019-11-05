import BaseService from '@App/common/services/base/base'
import BaseMapper from '@App/common/mappers/base/base'
import {RecordStorage} from '@App/common/storages/base'
import User from '@Entities/user/user'
import {WithRequestMetadata} from '@Types'
import {UserDTO} from '@Entities/user/userDTO'

export interface UserService extends BaseService {

  getUserInfo(): Promise<void>

  updateUserInfo(userData: UserDTO.UserUpdateDTO, userId: string): Promise<void>

}

export interface UserMapper extends BaseMapper {
  getUserInfo: WithRequestMetadata<User.UserInfo>
}

export interface UserRecordStorage extends RecordStorage<User.Records> {
}
