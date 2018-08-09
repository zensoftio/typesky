import {action, computed, observable} from 'mobx'

export namespace Changeset {

  export interface ChangesetField<ValueType> {
    value: ValueType | null,
    fieldName: string
    error: string | null
  }

  export type ValidationRule<Host, Key extends keyof Host> =
    (value: Host[Key] | null, field: ChangesetField<Host[Key]>, changeset: Changeset<Host>) => { valid: boolean, error?: string }

  export type ValidationRules<Host> = {
    [Key in keyof Host]? : ValidationRule<Host, Key>
  }

  class DefaultChangesetField<Host, Key extends keyof Host> implements ChangesetField<Host[Key]> {

    @computed
    get value(): Host[Key] | null {
      return this._value
    }

    set value(v: Host[Key] | null) {
      this._value = v
      this.onChange()
    }

    private _value: Host[Key] | null

    @observable
    error: string | null

    validation: ValidationRule<Host, Key>

    private readonly onChange: () => void

    readonly fieldName: string

    constructor(initialValue: Host[Key], validation: ValidationRule<Host, Key>, fieldName: Key, onChange: () => void) {

      this._value = initialValue
      this.validation = validation
      this.fieldName = fieldName
      this.onChange = onChange
    }
  }

  export class Changeset<Host> {

    @computed
    get fields(): {[Key in keyof Host]?: ChangesetField<Host[Key]>} {
      return this._fields
    }

    private _fields: {[Key in keyof Host]?: DefaultChangesetField<Host, Key>} = {}

    @observable
    isValid = true

    @observable
    isDirty = false

    private readonly hostObject: Host

    constructor(hostObject: Host, rules: ValidationRules<Host>) {

      this.hostObject = hostObject

      for (const property in rules) {
        if (rules.hasOwnProperty(property) /* Duh */ && hostObject.hasOwnProperty(property)) {

          this._fields[property] = observable(new DefaultChangesetField(hostObject[property], rules[property]!, property, this.valueChanged))
        }
        else {
          throw new Error(`Property '${property}' is not present in host object!`)
        }
      }
    }

    @action
    valueChanged = () => {
      this.isDirty = true
    }

    @action
    validate = () => {

      let valid = true

      for (const property in this._fields) {
        if (this._fields.hasOwnProperty(property)) {
          const field = this._fields[property]!

          const validation = field.validation(field.value, field, this as Changeset<Host>)
          valid = valid && validation.valid
          field.error = validation.valid ? null : validation.error || `${field.fieldName} is invalid`
        }
      }

      return this.isValid = valid
    }

    save = (): boolean => {
      if (this.validate) {
        for (const property in this._fields) {
          if (this._fields.hasOwnProperty(property) /* Duh */ && this.hostObject.hasOwnProperty(property)) {

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

      this.isDirty = false
      this.isValid = true
    }
  }
}
