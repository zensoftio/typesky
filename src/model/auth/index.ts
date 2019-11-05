import BaseService from '@App/common/services/base/base'
import BaseMapper from '@App/common/mappers/base/base'
import {Maybe, WithRequestMetadata} from '@Types'
import {RecordStorage} from '@App/common/storages/base'
import {Auth, CurrentUser, UserTokenInfo} from '@Entities/auth'
import {UserDTO} from '@Entities/user/userDTO'

export interface AuthService extends BaseService {
  login(username: string, password: string): Promise<void>

  signUp(data: UserDTO.SignUpDTO): Promise<void>

  logOut(): void

  checkUserAuthorised(): void

  getAuthInfo(): CurrentUser | undefined

  checkEmail(email: string): Promise<void>

  activateToken(token: string): void

  sendSignUpActivateLink(token: string): Promise<void>

  sendResetPasswordActivateLink(token: string): Promise<void>

  requestPasswordRecovery(forEmail: string): Promise<void>

  validateResetToken(token: string): Promise<void>

  resetPassword(newPassword: string, token: string): Promise<void>

  setHeaders(): void
}

export interface AuthMapper extends BaseMapper {
  isLoggedIn?: Maybe<boolean>
  isSignUpTokenActive?: WithRequestMetadata<UserTokenInfo>
  resetPasswordTokenValid: WithRequestMetadata<UserTokenInfo>
}

export interface AuthRecordStorage extends RecordStorage<Auth.Records> {

}
