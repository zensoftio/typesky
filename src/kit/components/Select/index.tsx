import * as React from 'react'
import Select from 'react-select'
import {CSSProperties} from 'react'
import {ValueType} from 'react-select/src/types'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'

const styles = require('./index.scss')

const customStyles = ({zIndex, isError}: { zIndex: number, isError?: boolean }) => (
  {
    option: (provided: CSSProperties, state: any) => ({
      ...provided,
      height: '55px',
      display: 'flex',
      color: state.isSelected ? '#4254F9' : '#11195B',
      cursor: 'pointer',
      alignItems: 'center',
      fontSize: '14px',
      lineHeight: '22px',
      letterSpacing: '-0.4px',
      borderBottom: '0.5px solid rgba(155, 158, 187, 0.5)',
      background: '#fff',
      [':active']: {
        background: '#fff !important',
      }
    }),
    menu: (provided: CSSProperties, state: any) => ({
      ...provided,
      zIndex,
      borderRadius: '6px',
      width: 'calc(100% - 2px)',
      margin: '-8px 0 0 1px'
    }),
    menuList: (provided: CSSProperties, state: any) => ({
      ...provided,
      ['&::-webkit-scrollbar-track']: {
        width: '2.5px'
      },
      ['&::-webkit-scrollbar']: {
        background: 'transparent',
        width: '2.5px'
      },
      ['&::-webkit-scrollbar-thumb']: {
        width: '2.5px',
        height: '102px',
        background: 'rgba(155, 158, 187, 0.3)',
        borderRadius: '12px'
      }
    }),
    indicatorSeparator: (provided: CSSProperties, state: any) => ({
      ...provided,
      display: 'none',
    }),
    singleValue: (provided: CSSProperties, state: any) => ({
      ...provided,
      fontSize: '14px',
    }),
    dropdownIndicator: (provided: CSSProperties, state: any) => ({
      ...provided,
      display: 'none',
    }),
    control: (provided: CSSProperties, state: any) => ({
      ...provided,
      zIndex: zIndex + 1,
      height: '55px',
      paddingLeft: '11px',
      border: isError ? '0.5px solid #FF5647' : state.isFocused ? '0.5px solid #4254F9' : '0.5px solid rgba(155, 158, 187, 0.5)',
      boxShadow: 'none',
      ['&:hover']: {
        border: isError ? '0.5px solid #FF5647' : state.isFocused ? '0.5px solid #4254F9' : '0.5px solid rgba(155, 158, 187, 0.5)',
      }
    }),
    container: (provided: CSSProperties, state: any) => ({
      ...provided,
      borderRadius: '6px',
      boxShadow: state.isFocused ? '0px 4px 20px rgba(71, 89, 250, 0.1)' : 'none'
    }),
    placeholder: (provided: CSSProperties, state: any) => ({
      ...provided,
      color: '#9B9EBB'
    }),
  }
)

interface Props {
  label?: string
  zIndex?: number
  isError?: boolean
  onBlur?: () => void
  noOptionsMessage?: () => string
  onInputChange?: (value: string) => void
  options: Array<{ value: string, label: string }>
  value: ValueType<{ value: string, label: string }>
  onChange: (value: ValueType<{ value: string, label: string }>) => void
}

@observer
export class SelectComponent extends React.Component<Props> {

  @observable
  inputValue = ''

  render() {
    const {value, options, onChange, label, onBlur, isError, onInputChange, noOptionsMessage = () => 'No results', zIndex = 1} = this.props
    return (
      <div className={styles['select-wrapper']}>
        <Select
          isSearchable
          value={value}
          onBlur={onBlur}
          options={options}
          placeholder={label}
          onChange={onChange}
          backspaceRemovesValue
          onInputChange={this.onChangeInput}
          noOptionsMessage={() => null}
          styles={customStyles({zIndex, isError})}
        />
        <legend
          className={[styles['legend'], !!value || !!this.inputValue ? styles['legend--active'] : ''].join(' ')}
          style={{zIndex: zIndex + 1}}
        >
          {
            label
          }
        </legend>
      </div>
    )
  }

  @action
  onChangeInput = (value: string) => {
    this.inputValue = value
    this.props.onInputChange && this.props.onInputChange(value)
  }
}
