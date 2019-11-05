import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {observer} from 'mobx-react'

const styles = require('./index.scss')

interface Props {
  isOpen: boolean
  onClose: () => void
  contentClassName?: string
  children?: React.ReactChild | React.ReactNode
}

@observer
export class Modal extends React.Component<Props> {
  private ref: HTMLDivElement
  private el = document.createElement('div')
  private existedDoc = document.getElementById('modal-root')
  private modalRoot = this.existedDoc ? this.existedDoc : document.createElement('div')

  private getRef = (ref: HTMLDivElement) => {
    this.ref = ref
  }

  constructor(props: Props) {
    super(props)
    this.el.setAttribute('class', 'modal-dialog')
    this.modalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(this.modalRoot)
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el)
  }

  render() {
    const {isOpen, contentClassName, children} = this.props
    if (!isOpen) {
      return null
    }
    return (
      <React.Fragment>
        {
          ReactDOM.createPortal(
            <div onMouseDown={this.handleClickOutside} className={styles['modal-backdrop']}>
              <div className={[styles['modal-container'], contentClassName].join(' ')}>
                <div ref={this.getRef} className={styles['modal']}>
                  {children}
                </div>
              </div>
            </div>,
            this.el
          )
        }
      </React.Fragment>
    )
  }

  onCloseDialog = () => {
    this.props.onClose()
  }

  handleClickOutside = (e: React.MouseEvent<HTMLElement>) => {
    if (this.ref && !this.ref.contains(e.target as Node)) {
      e.stopPropagation()
      this.onCloseDialog()
    }
  }
}
