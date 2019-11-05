import * as React from 'react'
import {FieldProps} from 'formik'

const styles = require('./index.scss')

interface Option {
  value: string
  label: string
}

interface RadioProps {
  options: Option[]
  title?: string
  onChange?: (value: Option) => void
}

const Radio = ({options, onChange, title, ...props}: RadioProps) => {
  const {field} = props as FieldProps
  const changeHandler = (item: Option) => () => {
    onChange && onChange(item)
  }

  return (
    <div className={styles['radio']}>
      {title && <div className={styles['radio__title']}>{title}</div>}
      {options.map((item: Option) => (
        <div key={item.value} className={styles['radio__item']}>
          <input
            className={styles['radio__input']}
            type='radio'
            name={field.name}
            value={item.value}
            onChange={changeHandler(item)}
          />
          <label htmlFor={field.name} className={styles['radio__label']}>{item.label}</label>
        </div>
      ))}
    </div>
  )
}

export default Radio
