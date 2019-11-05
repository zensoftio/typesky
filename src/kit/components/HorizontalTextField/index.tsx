import * as React from 'react'
import {SyntheticEvent} from 'react'
const styles = require('./index.scss')

interface Props {
  label: string
  name: string
  value: string
  disabled?: boolean
  striped?: boolean
  onChange?: (e: SyntheticEvent) => void
}
export const HorizontalTextField = ({label, name, value, onChange, disabled = true, striped = false}: Props) => (
  <div className={[styles['ht-field__content'], striped && styles['ht-field__content-striped']].join(' ').trim()}>
    <div className={styles['ht-field__content-left']}>
      <label className={styles['ht-field__label']}>{label}</label>
    </div>
    <div  className={styles['ht-field__content-right']}>
      <input type='text'
             name={name}
             className={styles['ht-field__input']}
             value={value}
             onChange={onChange}
             disabled={disabled}
      />
    </div>
  </div>
)
