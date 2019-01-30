import Changeset from './changeset'
import {isEmpty, ElementType} from './utils/common'

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
type LengthConstraintMessageBuilder = (fieldName: string, constraint: LengthConstraint, value: string | null | undefined) => string

type LengthConstraintStrategy = { match: LengthConstraintRule, validation: LengthConstraintValidation, message: LengthConstraintMessageBuilder }

const STRING_LENGTH_VALIDATION_STRATEGY: LengthConstraintStrategy[] = [

  { // min and max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, value) => !!value && value.trim().length >= constraint.min! && value.trim().length <= constraint.max!,
    message: (fieldName, constraint, value) => value ? `${fieldName} should be between ${constraint.min!} and ${constraint.max}` : `${fieldName} is required`
  },
  { // min constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, value) => !!value && value.trim().length >= constraint.min!,
    message: (fieldName, constraint, value) => value ? `${fieldName} should be longer than ${constraint.min!}` : `${fieldName} is required`
  },
  { // max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, value) => !!value && value.trim().length > 0 && value.trim().length <= constraint.max!,
    message: (fieldName, constraint, value) => value ? `${fieldName} should be shorter than ${constraint.max}` : `${fieldName} is required`
  },
  { // min and max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, value) => !value || (!!value && value.trim().length >= constraint.min! && value.trim().length <= constraint.max!),
    message: (fieldName, constraint) => `${fieldName} should be between ${constraint.min!} and ${constraint.max} or empty`
  },
  { // min constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, value) => !value || (!!value && value.trim().length >= constraint.min!),
    message: (fieldName, constraint) => `${fieldName} should be longer than ${constraint.min!} or empty`
  },
  { // max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, value) => !value || (!!value && value.trim().length <= constraint.max!),
    message: (fieldName, constraint) => `${fieldName} should be shorter than ${constraint.max} or empty`
  }
]

export interface RangeConstraint {
  min?: number
  max?: number
  allowEmpty?: boolean
}

export interface FloatNumberConstraint {
  precision: number,
  scale: number
}

type RangeConstraintRule = (constraint: RangeConstraint) => boolean
type RangeConstraintValidation = (constraint: RangeConstraint, value: number | null | undefined) => boolean
type RangeConstraintMessageBuilder = (fieldName: string, constraint: RangeConstraint) => string

type RangeConstraintStrategy = { match: RangeConstraintRule, validation: RangeConstraintValidation, message: RangeConstraintMessageBuilder }


const NUMBER_RANGE_VALIDATION_STRATEGY: RangeConstraintStrategy[] = [

  { // min and max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, value) => !!value && value >= constraint.min! && value <= constraint.max!,
    message: (fieldName, constraint) => `${fieldName} should be between ${constraint.min!} and ${constraint.max}`
  },
  { // min constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, value) => !!value && value >= constraint.min!,
    message: (fieldName, constraint) => `${fieldName} should be greater than ${constraint.min!}`
  },
  { // max constraint, empty not allowed
    match: constraint => !constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, value) => !!value && value.toString().length <= constraint.max!,
    message: (fieldName, constraint) => `${fieldName} should be less than ${constraint.max}`
  },
  { // min and max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !!constraint.max,
    validation: (constraint, value) => !value || (!!value && value >= constraint.min! && value <= constraint.max!),
    message: (fieldName, constraint) => `${fieldName} should be between ${constraint.min!} and ${constraint.max} or empty`
  },
  { // min constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !!constraint.min && !constraint.max,
    validation: (constraint, value) => !value || (!!value && value >= constraint.min!),
    message: (fieldName, constraint) => `${fieldName} should be greater than ${constraint.min!} or empty`
  },
  { // max constraint, empty allowed
    match: constraint => !!constraint.allowEmpty && !constraint.min && !!constraint.max,
    validation: (constraint, value) => !value || (!!value && value <= constraint.max!),
    message: (fieldName, constraint) => `${fieldName} should be less than ${constraint.max} or empty`
  }
]

type ValidationCondition<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> = (changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => boolean

/**
 * Generates validation rule that checks the presence of value.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {boolean} required
 * @returns {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>}
 */
const validatePresence = <Host, Keys extends keyof Host, Key extends Keys, ValueType = Host[Key], ProxyKeys extends keyof Host = never>(fieldName: string, required: boolean = true): Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys> => {

  return (value: ValueType | null) => {
    const valid = (required === !isEmpty(value))

    return {
      valid: valid,
      error: valid ? undefined : required ? `${fieldName} is required` : `${fieldName} should be empty`
    }
  }
}

/**
 * Generates validation rule that checks values by regular expression.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {string} format, regular expression to validate values by
 * @param {boolean} allowEmpty, determines whether empty values should be treated as valid
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys>}
 */
const validateFormat = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, format: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys> => {

  const regExp = new RegExp(format, 'i')

  return (value: string | null | undefined) => {

    const valid = (allowEmpty && isEmpty(value)) || (!!value && regExp.test(value))

    return {
      valid: valid,
      error: valid ? undefined : `${fieldName} has invalid format`
    }
  }
}

/**
 * Shorthand to generate email validation rules.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {boolean} allowEmpty, determines whether empty values should be treated as valid
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys>}
 */
const validateEmail = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys> => validateFormat(fieldName, EMAIL_FORMAT, allowEmpty)


/**
 * Shorthand to generate URL validation rules.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {boolean} allowEmpty, determines whether empty values should be treated as valid
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys>}
 */
const validateUrl = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys> => validateFormat(fieldName, URL_FORMAT, allowEmpty)

/**
 * Generates rule that validates length of incoming values
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {LengthConstraint} constraint, length constraint to check values by
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys>}
 */
const validateLength = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, constraint: LengthConstraint): Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys> => {

  const validation: LengthConstraintStrategy | undefined = STRING_LENGTH_VALIDATION_STRATEGY.find((strategy) => strategy.match(constraint))

  if (!validation) {
    throw new Error(`Invalid constraint for string length validator: ${constraint}`)
  }

  return (value: string | null | undefined) => {
    const valid = validation.validation(constraint, value)
    return {
      valid: valid,
      error: valid ? undefined : validation.message(fieldName, constraint, value)
    }
  }
}

/**
 * Generates rule that validates length of incoming values
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {LengthConstraint} constraint, length constraint to check values by
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string | null | undefined, ProxyKeys>}
 */
const validateNumberRange = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, constraint: RangeConstraint): Changeset.ValidationRule<Host, Keys, Key, number | null | undefined, ProxyKeys> => {

  const validation: RangeConstraintStrategy | undefined = NUMBER_RANGE_VALIDATION_STRATEGY.find((strategy) => strategy.match(constraint))

  if (!validation) {
    throw new Error(`Invalid constraint for string length validator: ${constraint}`)
  }

  return (value: number | null | undefined) => {
    const valid = validation.validation(constraint, value)
    return {
      valid: valid,
      error: valid ? undefined : validation.message(fieldName, constraint)
    }
  }
}

const validateFloatNumber = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, constraint: FloatNumberConstraint): Changeset.ValidationRule<Host, Keys, Key, number | null | undefined, ProxyKeys> => {

  const beforeDot = constraint.precision - constraint.scale;
  const afterDot = constraint.scale;

  const regExp = new RegExp('^(\\d{1,' + beforeDot + '})(\\.\\d{1,' + afterDot + '})?$')

  return (value: number | null | undefined) => {

    const valid = !!value && regExp.test(value.toString())

    return {
      valid: valid,
      error: valid ? undefined : `${fieldName} has invalid format`
    }
  }

}

/**
 * Utility to generate validation rules that validates arrays of values using other validation rules.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>} validator, validation rule to validate individual values by
 * @param {boolean} allowEmpty, determines whether empty values should be treated as valid
 * @returns {Changeset.ValidationRule<Host, Keys, Key, ValueType[], ProxyKeys>}
 */
const validateArray = <Host, Keys extends keyof Host, Key extends Keys, ValueType, ProxyKeys extends keyof Host = never>(fieldName: string, validator: Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, Array<ValueType>, ProxyKeys> => {

  return (value: Array<ValueType> | null, changeset) => {

    if (isEmpty(value)) {

      return {
        valid: allowEmpty,
        error: allowEmpty ? undefined : `${fieldName} is required`,
        meta: allowEmpty ? undefined : 0
      }
    }

    const invalidValueIndex = value!.findIndex((item) => {
      return !validator(item, changeset).valid
    })

    const valid = invalidValueIndex === -1

    return {
      valid: valid,
      error: valid ? undefined : `${fieldName} contains invalid values`,
      meta: valid ? undefined : invalidValueIndex
    }
  }
}

/**
 * Shorthand to generate presence validation rules for elements of array.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {boolean} allowEmpty, determines whether empty values should be treated as valid
 * @returns {Changeset.ValidationRule<Host, Keys, Key, ValueType[], ProxyKeys>}
 */
const validatePresenceArray = <Host, Keys extends keyof Host, Key extends Keys, ValueType = ElementType<Host[Key]>, ProxyKeys extends keyof Host = never>(fieldName: string, allowEmpty: boolean = false) => validateArray<Host, Keys, Key, ValueType, ProxyKeys>(fieldName, validatePresence<Host, Keys, Key, ValueType, ProxyKeys>(fieldName), allowEmpty)

/**
 * Shorthand to generate string-list length validation rules.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName, display name of field to generate error messages
 * @param {LengthConstraint} constraint, length constraint to check individual values by
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string[], ProxyKeys>}
 */
const validateStringArrayLength = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host>(fieldName: string, constraint: LengthConstraint) => validateArray<Host, Keys, Key, string, ProxyKeys>(fieldName, validateLength<Host, Keys, Key, ProxyKeys>(fieldName, constraint), constraint.allowEmpty)

/**
 * Shorthand to generate email-list validation rules.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {string} fieldName
 * @param {boolean} allowEmpty
 * @returns {Changeset.ValidationRule<Host, Keys, Key, string[], ProxyKeys>}
 */
const validateEmailArray = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never>(fieldName: string, allowEmpty: boolean = false): Changeset.ValidationRule<Host, Keys, Key, string[], ProxyKeys> => validateArray<Host, Keys, Key, string, ProxyKeys>(fieldName, validateEmail(fieldName, allowEmpty), allowEmpty)

/**
 * Utility to generate optional validation rules.
 * Checks changeset by passed condition and, if true, runs validation rule. Otherwise treats value as valid.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {ValidationCondition<Host, Keys, ProxyKeys>} condition, a condition to check Changeset by
 * @param {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>} rule, rule to validate value by if condition is true
 * @returns {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>}
 */
const validateOptional = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never, ValueType = Host[Key]>(condition: ValidationCondition<Host, Keys, ProxyKeys>, rule: Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>): Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys> => {

  return (value: ValueType | null, changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => {

    if (condition(changeset!)) {
      return rule(value, changeset)
    }

    return {valid: true}
  }
}

/**
 * Utility to generate validation rules that switches between two other rules depending on a condition.
 * Checks changeset by passed condition and, if true, runs first validation rule. Otherwise runs second validation rule.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {ValidationCondition<Host, Keys, ProxyKeys>} condition, a condition to check Changeset by
 * @param {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>} rule1, rule to validate value by if condition is true
 * @param {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>} rule2, rule to validate value by if condition is false
 * @returns {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>}
 */
const validateConditional = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never, ValueType = Host[Key]>(condition: ValidationCondition<Host, Keys, ProxyKeys>, rule1: Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>, rule2: Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>): Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys> => {

  return (value: ValueType | null, changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => {

    if (condition(changeset!)) {
      return rule1(value, changeset)
    }

    return rule2(value, changeset)
  }
}

/**
 * Utility to generate validation rule that checks value by several other rules.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @param {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>[]} rules, list of rules to check values by
 * @returns {Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>}
 */
const validateCompound = <Host, Keys extends keyof Host, Key extends Keys, ProxyKeys extends keyof Host = never, ValueType = Host[Key]>(rules: Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys>[]): Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys> => {

  return (value: ValueType | null, changeset: Changeset.Changeset<Host, Keys, ProxyKeys>) => {

    let validation: Changeset.ValidationResult<ValueType> | null = null

    rules.some((rule) => {

      validation = rule(value, changeset)

      return !validation.valid
    })

    return validation!
  }
}

/**
 * Generates a stub validation rule that treats any values as valid.
 * @template Host, Keys, Key, ValueType, ProxyKeys
 * @returns {Changeset.ValidationRule<Host, Keys, Key, Host[Key], ProxyKeys>}
 */
const validateAlwaysValid = <Host, Keys extends keyof Host, Key extends Keys, ValueType = Host[Key], ProxyKeys extends keyof Host = never>(): Changeset.ValidationRule<Host, Keys, Key, ValueType, ProxyKeys> => {
  return () => {
    return {valid: true}
  }
}

const ChangesetValidations = {

  validatePresence,
  validateLength,
  validateNumberRange,
  validateFloatNumber,

  validateFormat,
  validateEmail,
  validateUrl,

  validateArray,
  validatePresenceArray,
  validateStringArrayLength,
  validateEmailArray,

  validateOptional,
  validateConditional,

  validateCompound,

  validateAlwaysValid
}

export default ChangesetValidations
