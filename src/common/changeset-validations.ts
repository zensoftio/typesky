import Changeset from './changeset'
import {isEmpty} from './utils/common'

const EMAIL_FORMAT = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'

const URL_FORMAT = '^((https?:)?\\/\\/)?' + // protocol
  '(?:\\S+(?::\\S*)?@)?' + // authentication
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$' // fragment locater

const validateFormat = <Host, Keys extends keyof Host>(fieldName: string, format: string): Changeset.ValidationRule<Host, Keys, any, string> => {

  const regExp = new RegExp(format, 'i')

  return (value: string | null) => {

    const valid = regExp.test(value as any || '')

    return {
      valid: valid,
      error: valid ? undefined : `${fieldName} has invalid format`
    }
  }
}

interface LengthConstraint {
  min?: number
  max?: number
}

const ChangesetValidations = {
  validatePresence: <Host, Keys extends keyof Host>(fieldName: string, required: boolean = true): Changeset.ValidationRule<Host, Keys, any, Host[Keys]> => {

    return (value: Host[Keys] | null) => {

      const valid = (required === !isEmpty(value))

      return {
        valid: valid,
        error: valid ? undefined : required ? `${fieldName} is required` : `${fieldName} should be empty`
      }
    }
  },

  validateLength: <Host, Keys extends keyof Host>(fieldName: string, constraint: LengthConstraint): Changeset.ValidationRule<Host, Keys, any, string> => {

    const {min, max} = constraint

    if (min && max) {
      const message = `${fieldName} should be between ${min} and ${max}`

      return (value: string | null) => {
        const valid = value !== null && (value.length >= min) && (value.length <= max)

        return {
          valid: valid,
          error: valid ? undefined : message
        }
      }
    }
    else if (min) {
      const message = `${fieldName} should be longer than ${min}`

      return (value: string | null) => {
        const valid = value !== null && (value.length >= min)

        return {
          valid: valid,
          error: valid ? undefined : message
        }
      }
    }
    else if (max) {
      const message = `${fieldName} should be shorter than ${max}`

      return (value: string | null) => {
        const valid = value !== null && (value.length <= max)

        return {
          valid: valid,
          error: valid ? undefined : message
        }
      }
    }
    else {
      throw new Error('This validator requires at least one length constraint')
    }

  },

  validateAlwaysValid: <Host, Keys extends keyof Host, Key extends Keys>(): Changeset.ValidationRule<Host, Keys, any, Host[Key]> => {

    return () => {
      return {valid: true}
    }
  },

  validateFormat: validateFormat,
  validateEmail: <Host, Keys extends keyof Host>(fieldName: string): Changeset.ValidationRule<Host, Keys, any, string> => validateFormat(fieldName, EMAIL_FORMAT),
  validateUrl: <Host, Keys extends keyof Host>(fieldName: string): Changeset.ValidationRule<Host, Keys, any, string> => validateFormat(fieldName, URL_FORMAT),

  validateEmailArray: <Host, Key extends keyof Host>(fieldName: string) => {
    return (value: Host[Key] | null) => {

      const regExp = new RegExp(EMAIL_FORMAT)

      const arrayValue: string[] = value as any

      const valid = arrayValue.every((email: string) => regExp.test(email))

      const validationError = arrayValue.length > 0 ? `${fieldName} contains invalid emails` : `${fieldName} is required`

      return {
        valid: valid,
        error: (valid) ? undefined : validationError
      }
    }
  }
}

export default ChangesetValidations
