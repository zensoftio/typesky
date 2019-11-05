import * as React from 'react'

const styles = require('./index.scss')

interface Props {
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label?: string
  color?: string
  width?: string
  minHeight?: string
  border?: string
  zIndex?: number
  float?: boolean
  error?: boolean
  padding?: string
  fontSize?: string
  className?: string
  icon?: JSX.Element
  disabled?: boolean
  background?: string
  placeholder?: string
  borderRadius?: string
  labelClassName?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export class TextAreaField extends React.Component<Props> {

  render() {
    const {
      icon,
      float,
      zIndex,
      name,
      onChange,
      disabled,
      className,
      value = '',
      label = '',
      borderRadius,
      error = false,
      width = '100%',
      labelClassName,
      minHeight = '100px',
      padding = '22px',
      fontSize = '14px',
      placeholder = ' ',
      color = '#9B9EBB',
      background = '#fff',
      border = error ? '0.5px solid #FF5647' : undefined,
    } = this.props
    const textareaClassNames = [styles['textarea-field'], className].join(' ').trim()
    const floatStyles = {transform: float ? undefined : 'translate(0, -170%)', fontSize: float ? undefined : fontSize}
    const inputStyles = {
      color,
      width,
      minHeight,
      border,
      padding,
      fontSize,
      background,
      placeholder,
      borderRadius,
      backgroundColor: '#fff',
    }
    return (
      <div className={styles['textarea-field__wrapper']} style={{zIndex}}>
        <div className={textareaClassNames}>
          <textarea
            disabled={disabled}
            value={value}
            onChange={onChange}
            name={name}
            style={inputStyles}
            placeholder={placeholder}
            data-testid={label.toLowerCase().replace(' ', '-').concat('-id')}
            className={[styles['textarea-field__input']].join(' ').trim()}
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
}

export default TextAreaField
