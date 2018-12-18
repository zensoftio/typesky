import {action, computed, observable} from 'mobx'

export namespace Changeset {

  export interface ChangesetField<ValueType> {
    value: ValueType | null,
    readonly fieldName: string,
    validationResult: ValidationResult<ValueType> | undefined
    readonly isInvalid: boolean | undefined
    readonly isDirty: boolean
    readonly isInvalidAndDirty: boolean
  }

  export type ChangesetFields<Host, Keys extends keyof Host> = {
    readonly [Key in Keys]: ChangesetField<Host[Key]>
  }

  export type ValidationResult<ValueType> = {
    valid: boolean,
    error?: string,
    meta?: ValueType extends Array<any> ? number : ValueType extends Object ? string : never
  }

  export type ValidationRule<Host, Keys extends keyof Host, Key extends Keys, ValueType = Host[Key], ProxyKeys extends keyof Host = never> =
    (value: ValueType | null, changeset: Changeset<Host, Keys, ProxyKeys>) => ValidationResult<ValueType>

  export type ValidationRules<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> = {
    [Key in Keys]: ValidationRule<Host, Keys, Key, Host[Key], ProxyKeys>
  }

  class DefaultChangesetField<Host, Keys extends keyof Host, ProxyKeys extends keyof Host, Key extends Keys> implements ChangesetField<Host[Key]> {

    @computed
    get value(): Host[Key] | null {
      return this._value
    }

    set value(v: Host[Key] | null) {
      this._value = v
      this._isDirty = true
      this.onChange()
    }

    @computed
    get isInvalid(): boolean | undefined {
      return this.validationResult && !this.validationResult.valid
    }

    @computed
    get isDirty(): boolean {
      return this._isDirty
    }

    @computed
    get isInvalidAndDirty(): boolean {
      return this._isDirty && !!this.validationResult && !this.validationResult.valid
    }

    @observable
    private _value: Host[Key] | null

    @observable
    validationResult: ValidationResult<Host[Key]> | undefined

    @observable
    _isDirty: boolean = false

    readonly validation: ValidationRule<Host, Keys, Key, Host[Key], ProxyKeys>

    private readonly onChange: () => void

    readonly fieldName: string

    constructor(initialValue: Host[Key], validation: ValidationRule<Host, Keys, Key, Host[Key], ProxyKeys>, fieldName: Key, onChange: () => void) {

      this._value = initialValue
      this.validation = validation
      this.fieldName = fieldName
      this.onChange = onChange
    }
  }

  type DefaultChangesetFields<Host, Keys extends keyof Host, ProxyKeys extends keyof Host> = {
    [Key in Keys]: DefaultChangesetField<Host, Keys, ProxyKeys, Key>
  }

  export type ProxyFields<Host, Keys extends keyof Host> = {
    readonly [Key in Keys]: Host[Key]
  }

  export type ChangesetErrors<Host, Keys extends keyof Host> = {
    [Key in Keys]?: string
  }

  export type ChangesetParams<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> = {
    hostObject: Host
    rules: ValidationRules<Host, Keys, ProxyKeys>
    proxyFields?: ProxyKeys[]
    validateAutomatically?: boolean
  }

  export class Changeset<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> {

    @computed
    get fields(): ChangesetFields<Host, Keys> {
      return this._fields
    }

    @observable
    private readonly _fields: DefaultChangesetFields<Host, Keys, ProxyKeys>

    @computed
    get context(): ProxyFields<Host, ProxyKeys> {
      const proxy: any = {}

      for (const property of this._proxyFields) {

        if (this.hostObject.hasOwnProperty(property)) {

          Object.defineProperty(proxy, property, {
            get: () => this.hostObject[property]
          })
        }
        else {
          throw new Error(`Property '${property}' is not present in host object!`)
        }
      }

      return proxy
    }

    private readonly _proxyFields: ProxyKeys[]

    @computed
    get isValid(): boolean | undefined {

      const isValid: boolean | undefined = true

      return Object.keys(this._fields)
        .map(key => this._fields[(key as Keys)]).reduce((valid: boolean | undefined, field) => {
          return valid && (field.validationResult && field.validationResult.valid)
        }, isValid)
    }

    @computed
    get isDirty(): boolean {
      return Object.keys(this._fields)
        .map(key => this._fields[(key as Keys)])
        .some(field => field.isDirty)
    }

    @computed
    get errors(): ChangesetErrors<Host, Keys> {

      const errors: {[Key: string]: string} = {}

      for (const field in this._fields) {

        if (this._fields.hasOwnProperty(field)) {
          const validationResult = this._fields[field].validationResult
          if (validationResult && validationResult.error) {
            errors[field] = validationResult.error
          }
        }
      }

      return errors as ChangesetErrors<Host, Keys>
    }

    private readonly validateAutomatically: boolean

    private readonly hostObject: Host

    constructor(params: ChangesetParams<Host, Keys, ProxyKeys>) {

      const {hostObject, rules, proxyFields = [], validateAutomatically = false} = params

      this.hostObject = hostObject
      this.validateAutomatically = validateAutomatically

      const fields: any = {}

      for (const property in rules) {
        if (rules.hasOwnProperty(property) && hostObject.hasOwnProperty(property)) {

          fields[property] = observable(new DefaultChangesetField(hostObject[property], rules[property], property, this.valueChanged(property)))
        }
        else {
          throw new Error(`Property '${property}' is not present in host object!`)
        }
      }

      this._fields = fields

      const missingProperty = proxyFields.find((property) => !hostObject.hasOwnProperty(property))

      if (missingProperty) {

        throw new Error(`Property '${missingProperty}' is not present in host object!`)
      }

      this._proxyFields = proxyFields
    }

    private valueChanged = (property: Keys) => action(() => {

      if (this.validateAutomatically) {
        this.validate(false)
      }
      else {
        this.validateProperty(property, true)
      }
    })

    @action
    validate = (markAsDirty: boolean = true) => {

      Object.keys(this._fields)
        .forEach(key => this.validateProperty(key as Keys, markAsDirty))

      return this.isValid
    }

    @action
    private validateProperty(propertyName: Keys, markAsDirty: boolean = true) {
      if (this._fields.hasOwnProperty(propertyName)) {
        const field = this._fields[propertyName]

        const validationResult = field.validation(field.value, this as Changeset<Host, Keys, ProxyKeys>)
        field.validationResult = validationResult
        field._isDirty = field._isDirty || markAsDirty

        return validationResult.valid
      }

      throw new Error(`Field '${propertyName}' is no registered in changeset`)
    }

    @action
    save = (markAsDirty: boolean = true): boolean => {
      if (this.validate(markAsDirty)) {
        for (const property in this._fields) {
          if (this._fields.hasOwnProperty(property) && this.hostObject.hasOwnProperty(property)) {

            const field = this._fields[property]
            //@ts-ignore Fields of host object may be nullable. Checks for presence of field.value will incorrectly discard false values. Check for all possible conditions considered wasteful
            this.hostObject[property] = field.value
          }
        }

        return true
      }

      return false
    }

    @action
    rollback = () => {
      for (const property in this._fields) {
        if (this._fields.hasOwnProperty(property) && this.hostObject.hasOwnProperty(property)) {

          const field = this._fields[property]
          field.value = this.hostObject[property]
          field._isDirty = false
          field.validationResult = undefined
        }
      }
    }
  }
}

export default Changeset
