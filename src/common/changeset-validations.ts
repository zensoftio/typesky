import Changeset from './changeset'

const EMAIL_FORMAT = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'

const URL_FORMAT = '^((https?:)?\\/\\/)?'+ // protocol
  '(?:\\S+(?::\\S*)?@)?' + // authentication
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$' // fragment locater

const validateFormat = <Host, Key extends keyof Host>(fieldName: string, format: string): Changeset.ValidationRule<Host, Key, string> => {

  const regExp = new RegExp(format, 'i')

  return (value: string | null) => {

    const valid = regExp.test(value as any || '')

    return {
      valid: valid,
      error: valid ? undefined : `${fieldName} has invalid format`
    }
  }
}

const ChangesetValidations = {
  validatePresence: <Host, Key extends keyof Host>(fieldName: string, required: boolean): Changeset.ValidationRule<Host, Key> => {

    return (value: Host[Key] | null, field: Changeset.ChangesetField<Host[Key]>) => {

      const valid = required && !!value

      return {
        valid: valid,
        error: valid ? (required ? `${fieldName} should be present` : `${fieldName} should be empty`) : undefined
      }
    }
  },

  // validateLength: <Host, Key extends keyof Host>(fieldName: string, minLength?: number, maxLength?: number): Changeset.ValidationRule<Host, Key> => {
  //
  //   return (value: Host[Key] | null, field: Changeset.ChangesetField<Host[Key]>) => {
  //
  //     const rules = [
  //       minLength && `min:${minLength}`,
  //       maxLength && `max:${maxLength}`
  //     ]
  //
  //     const validator = new ValidatorFactory(field, rules.join('|'))
  //     validator.setAttributeNames({value: fieldName})
  //
  //     const validationErrors = validator.errors.get('value')
  //
  //     return {
  //       valid: validator.check(),
  //       error: (validationErrors && validationErrors.length > 0) ? validationErrors[0] : undefined
  //     }
  //   }
  // },

  validateAlwaysValid: <Host, Key extends keyof Host>(): Changeset.ValidationRule<Host, Key> => {

    return () => {
      return {valid: true}
    }
  },

  validateFormat: validateFormat,
  validateEmail: <Host, Key extends keyof Host>(fieldName: string): Changeset.ValidationRule<Host, Key, string> => validateFormat(fieldName, EMAIL_FORMAT),
  validateUrl: <Host, Key extends keyof Host>(fieldName: string): Changeset.ValidationRule<Host, Key, string> => validateFormat(fieldName, URL_FORMAT),

  validateEmailArray: <Host, Key extends keyof Host>(fieldName: string): Changeset.ValidationRule<Host, Key, string[]> => {
    return (value: string[] | null) => {

      const regExp = new RegExp(EMAIL_FORMAT)

      const valid = !!value && value.every((email: string) => regExp.test(email))

      const validationError = !!value && value.length > 0 ? `${fieldName} contains invalid emails` : `${fieldName} is required`

      return {
        valid: valid,
        error: (valid) ? undefined : validationError
      }
    }
  }
}

export default ChangesetValidations
