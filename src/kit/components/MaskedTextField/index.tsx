import * as React from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import MaskedInput from 'react-text-mask'

const styles = require('./index.scss')

interface Props {
  max?: string
  min?: string
  type?: string
  label?: string
  color?: string
  width?: string
  guide?: boolean
  height?: string
  border?: string
  zIndex?: number
  float?: boolean
  error?: boolean
  padding?: string
  fontSize?: string
  className?: string
  maxLength?: number
  minLength?: number
  icon?: JSX.Element
  disabled?: boolean
  background?: string
  placeholder?: string
  borderRadius?: string
  value: string | number
  inputClassName?: string
  dropDownOptions?: any[]
  labelClassName?: string
  visibilityButton?: boolean
  dropDownClassName?: string
  mask: Array<(RegExp | string)>
  dropDownArrayKeyAsValue?: string
  dropDownArrayKeyAsOption?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

@observer
export class MaskedTextField extends React.Component<Props> {

  @observable
  showPassword = false

  render() {
    const {
      mask,
      guide,
      float,
      onBlur,
      zIndex,
      onFocus,
      onChange,
      disabled,
      className,
      maxLength,
      minLength,
      value = '',
      label = '',
      error = false,
      width = '100%',
      labelClassName,
      inputClassName,
      height = '55px',
      padding = '0 22px',
      visibilityButton,
      fontSize = '14px',
      placeholder = ' ',
      color = '#9B9EBB',
      background = '#fff',
      borderRadius = '6px',
      border = error ? '0.5px solid #FF5647' : undefined,
    } = this.props
    const classNames = [styles['text-field'], className].join(' ').trim()
    const floatStyles = {transform: float ? undefined : 'translate(0, -170%)', fontSize: float ? undefined : fontSize}
    const inputStyles = {
      color,
      width,
      height,
      border,
      padding,
      fontSize,
      background,
      placeholder,
      borderRadius,
      backgroundColor: '#fff',
      paddingRight: visibilityButton ? '55px' : '22px',
    }
    return (
      <div className={styles['text-field__wrapper']} style={{zIndex}}>
        <div className={classNames}>
          {
            visibilityButton &&
            <div
              className={styles['text-field__show-hide-password']}
              data-testid={'text-field__show-hide-password-id'}
              onClick={this.togglePassword}
            >
              {
                this.showPassword ? 'Hide' : 'Show'
              }
            </div>
          }
          <MaskedInput
            mask={mask}
            guide={guide}
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            onChange={onChange}
            style={inputStyles}
            maxLength={maxLength}
            defaultValue={value}
            minLength={minLength}
            placeholder={placeholder}
            data-testid={label.toLowerCase().replace(' ', '-').concat('-id')}
            className={[inputClassName, styles['text-field__input']].join(' ').trim()}
          />
          <legend style={floatStyles} className={labelClassName}>
            {label}
          </legend>
        </div>
      </div>
    )
  }

  @action
  togglePassword = () => this.showPassword = !this.showPassword
}

export default MaskedTextField
