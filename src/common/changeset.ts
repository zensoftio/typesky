import {action, computed, observable, runInAction} from 'mobx'

export namespace Changeset {

  export interface ChangesetField<ValueType> {
    value: ValueType | null,
    fieldName: string,
    error: string | null
  }

  export type ChangesetFields<Host, Keys extends keyof Host> = {
    [Key in Keys]: ChangesetField<Host[Keys]>
  }

  export type ValidationResult = { valid: boolean, error?: string }

  export type ValidationRule<Host, Keys extends keyof Host, ProxyKeys extends keyof Host, ValueType = Host[Keys]> =
    (value: ValueType | null, field: ChangesetField<ValueType>, changeset: Changeset<Host, Keys, ProxyKeys>) => ValidationResult

  export type ValidationRules<Host, Keys extends keyof Host, ProxyKeys extends keyof Host> = {
    [Key in Keys]: ValidationRule<Host, Keys, ProxyKeys, Host[Key]>
  }

  class DefaultChangesetField<Host, Keys extends keyof Host, ProxyKeys extends keyof Host, Key extends Keys> implements ChangesetField<Host[Key]> {

    @computed
    get value(): Host[Key] | null {
      return this._value
    }

    set value(v: Host[Key] | null) {
      runInAction(() => {
        this._value = v
        this.onChange()
      })
    }

    @observable
    private _value: Host[Key] | null

    @observable
    error: string | null

    readonly validation: ValidationRule<Host, Keys, ProxyKeys, Host[Key]>

    private readonly onChange: () => void

    readonly fieldName: string

    constructor(initialValue: Host[Key], validation: ValidationRule<Host, Keys, ProxyKeys, Host[Key]>, fieldName: Key, onChange: () => void) {

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

  export class Changeset<Host, Keys extends keyof Host, ProxyKeys extends keyof Host = never> {

    @computed
    get fields(): ChangesetFields<Host, Keys> {
      return this._fields
    }

    @observable
    private readonly _fields: DefaultChangesetFields<Host, Keys, ProxyKeys>

    @computed
    get proxy(): ProxyFields<Host, ProxyKeys> {
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

    private _proxyFields: ProxyKeys[]

    @computed
    get isValid(): boolean | undefined {
      return this._isValid
    }

    @observable
    private _isValid: boolean | undefined = undefined

    @computed
    get isDirty(): boolean {
      return this._isDirty
    }

    private readonly validateAutomatically: boolean

    @observable
    private _isDirty = false

    private readonly hostObject: Host

    constructor(hostObject: Host, rules: ValidationRules<Host, Keys, ProxyKeys>, proxyFields: ProxyKeys[] = [], validateAutomatically: boolean = false) {

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
      this._proxyFields = proxyFields
    }

    private valueChanged = (property: Keys) => action(() => {
      this._isDirty = true

      if (this.validateAutomatically) {
        this.validate()
      }
      else {
        // isValid will remain undefined unless full validation is performed
        this.validateProperty(property)
      }
    })

    @action
    validate = () => {

      let valid = true

      for (const property in this._fields) {
        if (this._fields.hasOwnProperty(property)) {
          valid = this.validateProperty(property) && valid
        }
      }

      return this._isValid = valid
    }

    private validateProperty(propertyName: Keys) {
      if (this._fields.hasOwnProperty(propertyName)) {
        const field = this._fields[propertyName]

        const validation = field.validation(field.value, field, this as Changeset<Host, Keys, ProxyKeys>)
        field.error = validation.valid ? null : validation.error || `${field.fieldName} is invalid`

        return validation.valid
      }

      throw new Error(`Field '${propertyName}' is no registered in changeset`)
    }

    save = (): boolean => {
      if (this.validate()) {
        for (const property in this._fields) {
          if (this._fields.hasOwnProperty(property) && this.hostObject.hasOwnProperty(property)) {

            const field = this._fields[property]
            if (!!field) {
              //@ts-ignore Fields of host object may be nullable. Checks for presence of field.value will incorrectly discard false values. Check for all possible conditions considered wasteful
              this.hostObject[property] = field.value
            }
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
          if (!!field) {
            field.value = this.hostObject[property]
          }
        }
      }

      this._isDirty = false
      this._isValid = undefined
    }
  }
}

export default Changeset
