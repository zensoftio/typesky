import * as React from 'react'

const styles = require('./index.scss')

interface Props {
  width?: string
  border?: string
  height?: string
  disabled?: boolean
  className?: string
  onClick?: () => void
  primaryColor?: string
  borderRadius?: string
  secondaryColor?: string
  type?: 'submit' | 'button'
  disabledClassName?: string
  buttonContentClass?: string
  buttonWrapperClassName?: string
  children?: React.ReactChild | React.ReactNode
}

export class Button extends React.Component<Props> {
  render() {
    const {
      border,
      height,
      onClick,
      children,
      className,
      borderRadius,
      primaryColor,
      width = '100%',
      secondaryColor,
      type = 'button',
      disabled = false,
      buttonContentClass,
      buttonWrapperClassName,
      disabledClassName = styles['disabled'],
    } = this.props
    const buttonClassNames = [styles['button'], disabled ? disabledClassName : '', className].join(' ').trim()
    const buttonStyles = {
      height,
      border,
      borderRadius,
      width: '100%',
      background: secondaryColor,
    }
    return (
      <div className={[styles['button-wrapper'], buttonWrapperClassName].join(' ').trim()} style={{width}}>
        <button
          type={type}
          disabled={disabled}
          className={buttonClassNames}
          style={buttonStyles}
          onClick={onClick}
          data-testid={type.toLowerCase().concat('_button_id')}>
          <div
            className={[styles['children-element'], buttonContentClass].join(' ').trim()}
            style={{color: primaryColor}}
          >
            {children}
          </div>
        </button>
      </div>
    )
  }
}

export default Button
