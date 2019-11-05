import * as React from 'react'
import CheckIcon from '@Components/svg/CheckIcon'

const styles = require('./index.scss')

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  checkedClassName?: string
  checkedIcon?: JSX.Element
  className?: string
  checked?: boolean
  value?: string
  id: string
}

export const CheckBox = (
  {
    checkedIcon = <CheckIcon className={styles['check-icon']}/>,
    checkedClassName,
    className,
    onChange,
    checked,
    value,
    id
  }: Props) => (
  <label htmlFor={id} data-testid={id.concat('__checkbox-id')} className={styles['checkbox__label']}>
    <div
      className={[
        styles['checkbox'],
        className,
        checked ? [checkedClassName, styles['highlight']].join(' ') : ''
        ].join(' ').trim()}
    />
    <input type='checkbox' value={value} id={id} className={styles['checkbox__input']} checked={checked} onChange={onChange}/>
    <div className={styles['checkbox__icon']}>
      {checkedIcon}
    </div>
  </label>
)

export default CheckBox
