import {action, computed, observable, runInAction} from 'mobx'
import {isEmpty} from './utils/common'

export namespace Changeset {

  export interface ChangesetField<ValueType> {
    value: ValueType | null,
    fieldName: string,
    validationResult: ValidationResult<ValueType> | undefined
    readonly isDirty: boolean
    readonly isInvalidAndDirty: boolean
  }

  export type ChangesetFields<Host, Keys extends keyof Host> = {
    [Key in Keys]: ChangesetField<Host[Key]>
  }

  export type ValidationResult<ValueType> = {
    valid: boolean,
    error?: string,
    meta?: ValueType extends Array<any> ? number : ValueType extends Object ? string : never
  }

  export type ValidationRule<Host, Keys extends keyof Host, Key extends keyof Host, ProxyKeys extends keyof Host = never, ValueType = Host[Key]> =
    (value: ValueType | null, field: ChangesetField<ValueType>, changeset: Changeset<Host, Keys, ProxyKeys>) => ValidationResult<ValueType>

  export type ValidationRules<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> = {
    [Key in Keys]: ValidationRule<Host, Keys, Key, ProxyKeys, Host[Key]>
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

    readonly validation: ValidationRule<Host, Keys, Key, ProxyKeys, Host[Key]>

    private readonly onChange: () => void

    readonly fieldName: string

    constructor(initialValue: Host[Key], validation: ValidationRule<Host, Keys, Key, ProxyKeys, Host[Key]>, fieldName: Key, onChange: () => void) {

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
      //TODO: Think of computing valida state the same way as isDirty
      return this._isValid
    }

    @observable
    private _isValid: boolean | undefined = undefined

    @computed
    get isDirty(): boolean {
      return Object.keys(this._fields)
        .map(key => this._fields[(key as Keys)])
        .some(field => field.isDirty)
    }

    @computed
    get errors(): ChangesetErrors<Host, Keys> {

      const errors: any = {}

      for (const field in this._fields) {

        if (this._fields.hasOwnProperty(field)) {
          const validationResult = this._fields[field].validationResult
          if (validationResult) {
            errors[field] = validationResult.error
          }
        }
      }

      return errors
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
        // isValid will remain undefined unless full validation is performed
        this.validateProperty(property, true)
      }
    })

    @action
    validate = (markAsDirty: boolean = true) => {

      let valid = true

      for (const property in this._fields) {
        if (this._fields.hasOwnProperty(property)) {
          valid = this.validateProperty(property, markAsDirty) && valid
        }
      }

      return this._isValid = valid
    }

    private validateProperty(propertyName: Keys, markAsDirty: boolean = true) {
      if (this._fields.hasOwnProperty(propertyName)) {
        const field = this._fields[propertyName]

        const validationResult = field.validation(field.value, field, this as Changeset<Host, Keys, ProxyKeys>)
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
        }
      }

      this._isValid = undefined
    }
  }
}

export default Changeset
