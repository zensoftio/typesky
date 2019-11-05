import * as React from 'react'

const styles = require('./index.scss')

export const Hamburger = ({onClick, color = '#11195B'}: {onClick: () => void, color?: string}) => (
  <div className={styles['hamburger']} onClick={onClick}>
    <div className={styles['hamburger__item']} style={{background: color}}/>
    <div className={styles['hamburger__item']} style={{background: color}}/>
    <div className={styles['hamburger__item']} style={{background: color}}/>
  </div>
)

export default Hamburger
