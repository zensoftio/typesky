import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import * as React from 'react'
import {ResolutionType} from '@App/enum/resolution'
import {getWindowResolution} from '@App/helpers/utils'

interface Props {
  mobile?: JSX.Element
  desktop?: JSX.Element
}

@observer
export default class ResolutionResolver extends React.Component<Props> {

  @observable
  isMobile: boolean

  componentDidMount() {
    this.setResolution()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    return (
      <div>
        {
          this.isMobile ? !!this.props.mobile && this.props.mobile : !!this.props.desktop && this.props.desktop
        }
      </div>
    )
  }

  @action
  setResolution() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  @action
  onResize = () => {
    this.isMobile = getWindowResolution() === ResolutionType.mobile
  }
}
