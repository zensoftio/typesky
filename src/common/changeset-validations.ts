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

export interface LengthConstraint {
  min?: number
  max?: number
  allowEmpty?: boolean
}

type LengthConstraintRule = (constraint: LengthConstraint) => boolean
type LengthConstraintValidation = (constraint: LengthConstraint, value: string | null | undefined) => boolean
type LengthConstraintMessageBuilder = (fieldName: string, constraint: LengthConstraint) => string

type LengthConstraintStrategy = { match: LengthConstraintRule, validation: LengthConstraintValidation, message: LengthConstraintMessageBuilder }

const STRING_LENGTH_VALIDATION_STRATEGY: LengthConstraintStrategy[] = [

  { // min and max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, value) => !!value && value.length >= constraint.min! && value.length <= constraint.max!,
    message: (fieldName, constraint) => `${fieldName} should be between ${constraint.min!} and ${constraint.max}`
  },
  { // min constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, value) => !!value && value.length >= constraint.min!,
    message: (fieldName, constraint) => `${fieldName} should be longer than ${constraint.min!}`
  },
  { // max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, value) => !!value && value.length <= constraint.max!,
    message: (fieldName, constraint) => `${fieldName} should be shorter than ${constraint.max}`
  },
  { // min and max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, value) => !value || (!!value && value.length >= constraint.min! && value.length <= constraint.max!),
    message: (fieldName, constraint) => `${fieldName} should be between ${constraint.min!} and ${constraint.max} or empty`
  },
  { // min constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, value) => !value || (!!value && value.length >= constraint.min!),
    message: (fieldName, constraint) => `${fieldName} should be longer than ${constraint.min!} or empty`
  },
  { // max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, value) => !value || (!!value && value.length <= constraint.max!),
    message: (fieldName, constraint) => `${fieldName} should be shorter than ${constraint.max} or empty`
  }
]

type ArrayLengthConstraintValidation = (constraint: LengthConstraint, value: string[] | null) => number

type ArrayLengthConstraintStrategy = { match: LengthConstraintRule, validation: ArrayLengthConstraintValidation, message: LengthConstraintMessageBuilder }

const STRING_ARRAY_LENGTH_VALIDATION_STRATEGY: ArrayLengthConstraintStrategy[] = [

  { // min and max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, values) => !values ? 0 : values.findIndex(value => value.length < constraint.min! || value.length > constraint.max!),
    message: (fieldName, constraint) => `Values in ${fieldName} should be between ${constraint.min!} and ${constraint.max}`
  },
  { // min constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, values) => !values ? 0 : values.findIndex(value => value.length < constraint.min!),
    message: (fieldName, constraint) => `Values in ${fieldName} should be longer than ${constraint.min!}`
  },
  { // max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, values) => !values ? 0 : values.findIndex(value => value.length > constraint.max!),
    message: (fieldName, constraint) => `Values in ${fieldName} should be shorter than ${constraint.max}`
  },
  { // min and max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, values) => !values ? -1 : !!values && values.findIndex(value => isEmpty(value) || value.length < constraint.min! || value.length > constraint.max!),
    message: (fieldName, constraint) => `Values in ${fieldName} should be between ${constraint.min!} and ${constraint.max} or empty`
  },
  { // min constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, values) => !values ? -1 : !!values && values.findIndex(value => isEmpty(value) || value.length < constraint.min!),
    message: (fieldName, constraint) => `Values in ${fieldName} should be longer than ${constraint.min!} or empty`
  },
  { // max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, values) => !values ? -1 : !!values && values.findIndex(value => isEmpty(value) || value.length > constraint.max!),
    message: (fieldName, constraint) => `Values in ${fieldName} should be shorter than ${constraint.max} or empty`
  }
]

type ValidationCondition<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> = (changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => boolean

const validateFormat = <Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never>(fieldName: string, format: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, string | null | undefined> => {

  const regExp = new RegExp(format, 'i')

  return (value: string | null | undefined) => {

    const valid = (allowEmpty && isEmpty(value)) || (!!value && regExp.test(value))

    return {
      valid: valid,
      error: valid ? undefined : `${fieldName} has invalid format`
    }
  }
}

const ChangesetValidations = {
  validatePresence: <Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never>(fieldName: string, required: boolean = true): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys> => {

    return (value: Host[Key] | null) => {
      const valid = (required === !isEmpty(value))

      return {
        valid: valid,
        error: valid ? undefined : required ? `${fieldName} is required` : `${fieldName} should be empty`
      }
    }
  },

  validateLength: <Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never>(fieldName: string, constraint: LengthConstraint): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, string | null | undefined> => {

    const validation: LengthConstraintStrategy | undefined = STRING_LENGTH_VALIDATION_STRATEGY.find((strategy) => strategy.match(constraint))

    if (!validation) {
      throw new Error(`Invalid constraint for string length validator: ${constraint}`)
    }

    return (value: string | null | undefined) => {
      const valid = validation.validation(constraint, value)
      return {
        valid: valid,
        error: valid ? undefined : validation.message(fieldName, constraint)
      }
    }
  },

  validateStringArrayLength: <Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never>(fieldName: string, constraint: LengthConstraint): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, string[]> => {

    const validation: ArrayLengthConstraintStrategy | undefined = STRING_ARRAY_LENGTH_VALIDATION_STRATEGY.find((strategy) => strategy.match(constraint))

    if (!validation) {
      throw new Error(`Invalid constraint for string array length validator: ${constraint}`)
    }

    return (value: string[] | null) => {

      const validationResult = validation.validation(constraint, value)

      const valid = validationResult === -1

      return {
        valid: valid,
        error: valid ? undefined : validation.message(fieldName, constraint),
        meta: valid ? undefined : validationResult
      }
    }
  },

  validateAlwaysValid: <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, Host[Key]> => {

    return () => {
      return {valid: true}
    }
  },

  validateFormat: validateFormat,
  validateEmail: <Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never>(fieldName: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, string | null | undefined> => validateFormat(fieldName, EMAIL_FORMAT, allowEmpty),
  validateUrl: <Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never>(fieldName: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, string | null | undefined> => validateFormat(fieldName, URL_FORMAT, allowEmpty),

  validateEmailArray: <Host, Key extends keyof Host>(fieldName: string) => {
    return (value: Host[Key] | null) => {

      const regExp = new RegExp(EMAIL_FORMAT)

      const arrayValue: string[] = value as any

      const invalidEmailIndex = arrayValue.findIndex((email: string) => regExp.test(email))

      const valid = (invalidEmailIndex === -1)

      const validationError = arrayValue.length > 0 ? `${fieldName} contains invalid emails` : `${fieldName} is required`

      return {
        valid: valid,
        error: valid ? undefined : validationError,
        meta: valid ? undefined : invalidEmailIndex
      }
    }
  },

  validatePresenceArray: <Host, Key extends keyof Host>(fieldName: string) => {
    return (value: Host[Key] | null) => {

      const arrayValue: string[] = value as any

      const invalidElementIndex = arrayValue.findIndex((singleValue) => isEmpty(singleValue))

      const valid = (invalidElementIndex === -1)

      const validationError = arrayValue.length > 0 ? `${fieldName} contains invalid phone numbers` : `${fieldName} is required`

      return {
        valid: valid,
        error: (valid) ? undefined : validationError,
        meta: valid ? undefined : invalidElementIndex
      }

    }
  },

  validateConditional: <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never, ValueType = Host[Key]>(condition: ValidationCondition<Host, Keys, ProxyKeys>, rule: Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, ValueType>) => {

    return (value: ValueType | null, field: Changeset.ChangesetField<ValueType>, changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => {

      if (condition(changeset)) {
        return rule(value, field, changeset)
      }

      return {valid: true}
    }
  },

  validateCompound: <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never, ValueType = Host[Key]>(rules: Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, ValueType>[]): Changeset.ValidationRule<Host, Keys, Key, ProxyKeys, ValueType> => {

    return (value: ValueType | null, field: Changeset.ChangesetField<ValueType>, changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => {

      let validation: Changeset.ValidationResult<ValueType> | null = null

      rules.some((rule) => {

        validation = rule(value, field, changeset)

        return !validation.valid
      })

      return validation!
    }
  }
}

export default ChangesetValidations
