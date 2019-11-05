import * as React from 'react'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import {Filter} from '@App/dicts/interfaces'

const styles = require('./index.scss')

interface InputMultipleFilterProps {
  filterName: string
  onUpdate: (filter: Filter) => void
  onReset: (filterName: string) => void
  initialFilters?: string[]
  customClass?: string
  label?: string
}

@observer
export class InputMultipleFilter extends React.Component<InputMultipleFilterProps> {
  @observable filterValue: string = ''
  @observable currentFilters = this.props.initialFilters || []

  render() {
    const { filterName, label = filterName } = this.props
    return (
      <div className={styles['multiple-filter__wrapper']}>
        <form onSubmit={this.addFilter} className={styles['multiple-filter__form']}>
          <label htmlFor={filterName} className={styles['multiple-filter__form-label']}>
            {label} {!!this.currentFilters.length && (
            <div onClick={this.resetFilters} className={styles['multiple-filter__form-reset']}>
              {this.currentFilters.length}
            </div>
          )}
          </label>

          <div className={styles['multiple-filter__form-inner']}>
            <div className={styles['multiple-filter__form-header']}>
              <input id={filterName}
                     type='text'
                     autoFocus={false}
                     placeholder={'Enter values here ...'}
                     name={filterName}
                     onChange={this.changeFilterValue}
                     value={this.filterValue}
                     className={styles['multiple-filter__form-input']}
              />
              <div onClick={this.addFilter} className={styles['multiple-filter__form-add']}>+</div>
            </div>

            <div className={styles['multiple-filter__current']}>
              {this.currentFilters.map((filter, index) => (
                <p className={styles['multiple-filter__current-item']}  key={index}>
                  {filter}
                  <i className={styles['multiple-filter__current-item-remove']}
                     onClick={this.removeFilter(filter)}>x
                  </i>
                </p>
              ))}
            </div>
          </div>
        </form>
      </div>
    )
  }

  @action
  changeFilterValue = ({target: {value}}: React.BaseSyntheticEvent) => {
    this.filterValue = value.trim()
  }

  @action
  addFilter = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    if (this.filterValue && !this.currentFilters.includes(this.filterValue)) {
      this.currentFilters.push(this.filterValue)
      this.props.onUpdate({[this.props.filterName]: this.currentFilters })
    }
    this.filterValue = ''
  }

  removeFilter = (filterName: string) => action(() => {
    this.currentFilters = this.currentFilters.filter((filter: string) => filter !== filterName)
    !!this.currentFilters.length
      ? this.props.onUpdate({[this.props.filterName]: this.currentFilters })
      : this.props.onReset(this.props.filterName)
  })

  @action
  resetFilters = () => {
    this.currentFilters = []
    this.props.onReset(this.props.filterName)
  }
}

export default InputMultipleFilter
