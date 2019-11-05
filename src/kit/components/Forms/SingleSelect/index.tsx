import * as React from 'react'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import {Maybe} from '@Types'
import TextField from '@Components/TextField'

const styles = require('./index.scss')

interface Option {
  value: string,
  label: string
}

export interface SingleSelectProps {
  options: Option[]
  label?: string
  noOptionsMessage?: () => string
  onInputChange?: (value: string) => void
  onChange?: (value: Option) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

@observer
export class SingleSelect extends React.Component<SingleSelectProps> {
  @observable text: string = ''
  @observable suggestions: string[] = []
  @observable selection: Maybe<Option>

  render() {
    const {label, onBlur} = this.props
    return (
      <div className={styles['single-select']}>
        <div className={styles['single-select__inner']}>
          <TextField float
                     borderRadius={'6px'}
                     label={label}
                     onChange={this.onTextChanged}
                     value={this.text}
                     onBlur={onBlur}
          />
          {this.suggestions.length > 0 && (
            <div className={styles['single-select__suggestions']}>
              {this.renderSuggestions()}
            </div>
          )}
        </div>
      </div>)
  }

  renderSuggestions() {
    if (this.suggestions.length === 0) {
      return null
    }

    return (
      <ul className={styles['single-select__list']}>
        {this.suggestions.map((item, index) => (
          <li key={index}
              onClick={() => this.suggestionSelected(item)}
              className={styles['single-select__list-item']}
          >{item}</li>
        ))}
      </ul>
    )
  }

  @action
  onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    let suggestions: string[] = []
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, 'i')
      const labels = this.props.options.map(d => d.label)
      suggestions = labels.sort().filter(v => regex.test(v))
    }
    this.suggestions = suggestions
    this.text = value

    this.props.onInputChange && this.props.onInputChange(value)
  }

  @action
  suggestionSelected = (value: string) => {
    this.text = value
    this.suggestions = []
    try {
      this.selection = this.props.options.find((item: Option) => item.label === value)
      this.selection && this.props.onChange && this.props.onChange(this.selection)
    } catch (e) {
      this.selection = undefined
    }
  }
}

export default SingleSelect
