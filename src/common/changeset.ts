import {action, computed, observable, runInAction} from 'mobx'

export namespace Changeset {

  export interface ChangesetField<ValueType> {
    value: ValueType | null,
    fieldName: string,
    error: string | null
  }

  export type ValidationResult = { valid: boolean, error?: string }

  export type ValidationRule<Host, Keys extends keyof Host, ValueType = Host[Keys]> =
    (value: ValueType | null, field: ChangesetField<ValueType>, changeset: Changeset<Host, Keys>) => ValidationResult

  export type ValidationRules<Host, Keys extends keyof Host> = {
    [Key in Keys]: ValidationRule<Host, Keys, Host[Key]>
  }

  class DefaultChangesetField<Host, Keys extends keyof Host, Key extends Keys> implements ChangesetField<Host[Key]> {

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

    readonly validation: ValidationRule<Host, Keys, Host[Key]>

    private readonly onChange: () => void

    readonly fieldName: string

    constructor(initialValue: Host[Key], validation: ValidationRule<Host, Keys, Host[Key]>, fieldName: Key, onChange: () => void) {

      this._value = initialValue
      this.validation = validation
      this.fieldName = fieldName
      this.onChange = onChange
    }
  }

  export class Changeset<Host, Keys extends keyof Host> {

    @computed
    get fields(): {[Key in Keys]: ChangesetField<Host[Key]>} {
      return this._fields
    }

    @observable
    private readonly _fields: {[Key in Keys]: DefaultChangesetField<Host, Keys, Key>}

    @computed
    get isValid(): boolean {
      return this._isValid
    }

    @observable
    private _isValid = true

    @computed
    get isDirty(): boolean {
      return this._isDirty
    }

    @observable
    private _isDirty = false

    private readonly hostObject: Host

    constructor(hostObject: Host, rules: ValidationRules<Host, Keys>) {

      this.hostObject = hostObject

      const fields: any = {}

      for (const property in rules) {
        if (rules.hasOwnProperty(property) && hostObject.hasOwnProperty(property)) {

          fields[property] = observable(new DefaultChangesetField(hostObject[property], rules[property]!, property, this.valueChanged))
        }
        else {
          throw new Error(`Property '${property}' is not present in host object!`)
        }
      }

      this._fields = fields
    }

    @action
    private valueChanged = () => {
      this._isDirty = true
      this.validate()
    }

    @action
    validate = () => {

      let valid = true

      for (const property in this._fields) {
        if (this._fields.hasOwnProperty(property)) {
          const field = this._fields[property]!

          const validation = field.validation(field.value, field, this as Changeset<Host, Keys> /* Duh */)
          valid = valid && validation.valid
          field.error = validation.valid ? null : validation.error || `${field.fieldName} is invalid`
        }
      }

      return this._isValid = valid
    }

    save = (): boolean => {
      if (this.validate) {
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
        if (this._fields.hasOwnProperty(property) /* Duh */ && this.hostObject.hasOwnProperty(property)) {

          const field = this._fields[property]
          if (!!field) {
            field.value = this.hostObject[property]
          }
        }
      }

      this._isDirty = false
      this._isValid = true
    }
  }
}

export default Changeset
