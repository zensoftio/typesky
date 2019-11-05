import * as React from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'

const styles = require('./index.scss')

interface Props {
  header: JSX.Element
  content: JSX.Element
  className?: string
}

@observer
class DropdownList extends React.Component<Props> {
  @observable isOpen: boolean = false

  render() {
    const {header, content, className = ''} = this.props
    return (
      <div className={[styles['dropdown-list'], className].join(' ').trim()}>
        <div className={styles['dropdown-list__header']}  onClick={this.toggleDropdown}>
          {header}
        </div>

        <div className={styles['dropdown-list__content']}>
          {this.isOpen && content}
        </div>
      </div>
    )
  }

  @action
  toggleDropdown = () => this.isOpen = !this.isOpen
}

export default DropdownList
