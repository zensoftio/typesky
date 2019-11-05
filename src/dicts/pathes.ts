import {configuration} from '../configs'

const base = (rest: string) => `${configuration.api}/${rest}`

const auth = (rest: string) => base(`auth/${rest}`)

export default class Pathes {
  static Auth = class {
    static signIn = auth('signIn')
    static emailValidation = auth('doValidateEmail')
    static signUp = auth('signUp')
    static activate = auth('doActivateUser')
    static forgotPassword = auth('doRequestResetPasswordToken')
    static validateResetPasswordToken = auth('doCheckResetPasswordToken')
    static resetPassword = auth('doResetPassword')
    static sendEmailActivateLink = auth('doRequestSignUpVerifyLink')
    static sendResetPasswordActivateLink = auth('doRequestResetPasswordVerifyLink')
  }
  static User = class {
    static userInfo = base('passengers/info')
    static userUpdateInfo = (userId: string) => base(`passengers/${userId}`)
  }
}
