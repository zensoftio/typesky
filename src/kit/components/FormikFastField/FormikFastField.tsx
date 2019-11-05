import * as React from 'react'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'

export interface FormikFastFieldRenderProps {
  value: string | number
  onChange: (e: React.ChangeEvent) => void
  setField: (value: string | number) => void
  outer: FormikFastFieldProps
}

interface FormikFastFieldProps {
  render: (props: FormikFastFieldRenderProps) => JSX.Element
  value: string | number
  onBlur?: (e: React.FocusEvent) => void
  setFieldValue?: (key: string, val: string | number) => void
  onChange?: (e: React.ChangeEvent) => void
}

@observer
export class FormikFastField extends React.Component<FormikFastFieldProps> {

  @observable
  localValue = this.props.value

  render() {
    const {render} = this.props
    return (
      <React.Fragment>
        {render({
          value: this.localValue,
          onChange: this.handleChange,
          setField: this.setFieldValue,
          outer: this.props
        })}
      </React.Fragment>
    )
  }

  @action
  handleChange = (e: React.ChangeEvent<any>) => {
    const {onChange} = this.props
    this.localValue = this.localValue = e.target.value
    onChange && onChange(e)
  }

  @action
  setFieldValue = (value: string | number) => {
    this.localValue = value
  }
}

export default FormikFastField
