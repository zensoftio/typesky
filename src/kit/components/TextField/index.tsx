import * as React from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {WithTranslation, withTranslation} from 'react-i18next'

const styles = require('./index.scss')

interface Props extends WithTranslation {
  max?: string
  min?: string
  type?: string
  label?: string
  color?: string
  width?: string
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
  dropDownArrayKeyAsValue?: string
  dropDownArrayKeyAsOption?: string
  getFocus?: (getFocus: () => void) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

@observer
export class TextField extends React.Component<Props> {

  inputRef = React.createRef<HTMLInputElement>()

  @observable
  showPassword = false

  componentDidMount() {
    this.props.getFocus && this.props.getFocus(this.getFocus)
  }

  render() {
    const {
      t,
      min,
      max,
      type,
      icon,
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
      inputClassName,
      labelClassName,
      height = '55px',
      visibilityButton,
      fontSize = '14px',
      placeholder = ' ',
      color = '#9B9EBB',
      background = '#fff',
      padding = '0 22px',
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
      paddingRight: visibilityButton ? '75px' : '22px',
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
                this.showPassword ? t('authentication.hide') : t('authentication.show')
              }
            </div>
          }
          <input
            min={min}
            max={max}
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={this.inputRef}
            disabled={disabled}
            onChange={onChange}
            style={inputStyles}
            maxLength={maxLength}
            minLength={minLength}
            placeholder={placeholder}
            autoComplete={`new-${type}`}
            data-testid={label.toLowerCase().replace(' ', '-').concat('-id')}
            type={type && type !== 'password' && !this.showPassword ? type : 'text'}
            className={
              [
                inputClassName,
                styles['text-field__input'],
                this.showPassword || type !== 'password' ? '' : styles['password']
              ].join(' ').trim()
            }
          />
          <legend style={floatStyles} className={labelClassName}>
            {label}
          </legend>
          <div className={styles['icon']}>
            {
              icon
            }
          </div>
        </div>
      </div>
    )
  }

  getFocus = () => {
    this.inputRef && this.inputRef.current && this.inputRef.current.focus()
  }

  @action
  togglePassword = () => this.showPassword = !this.showPassword
}

export default withTranslation()(TextField)
