import * as React from 'react'
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {observer} from 'mobx-react'
import {ROUTES} from './routes'
import {renderRoutes} from 'react-router-config'
import './assets/styles/common.scss'
import {computed} from 'mobx'
import {ComponentDependencies, withDependencies, WithDependencies} from 'type-injector'
import {AuthMapper, AuthService} from '@App/model/auth'
import {SYSTEM_LAYERS} from '@App/layers'
import defineAbilitiesFor from '@App/configs/ability'
import {AbilityContext} from '@App/configs/ability-context'

const styles = require('./App.scss')

const history = createBrowserHistory()

interface Dependencies extends ComponentDependencies {
  authService: AuthService
  authMapper: AuthMapper
}

interface Props extends WithDependencies<Dependencies> {}

@observer
export class App extends React.Component<Props> {

  componentDidMount() {
    this.props.deps.authService.checkUserAuthorised()
  }

  @computed
  get allowedRoutes() {
    const isLogged = this.props.deps.authMapper.isLoggedIn
    const currentUser = this.props.deps.authService.getAuthInfo()
    return ROUTES.filter(route => route.check ? route.check(!!isLogged, currentUser) : true) || []
  }

  render() {
    if (this.props.deps.authMapper.isLoggedIn === undefined) {
      // TODO Add loader after getting it in design
      return <div/>
    }
    const currentUser = this.props.deps.authService.getAuthInfo()
    return (
        <AbilityContext.Provider
            value={defineAbilitiesFor(currentUser)}
        >
          <div className={styles['app']}>
            <Router history={history}>
              {renderRoutes(this.allowedRoutes)}
            </Router>
          </div>
        </AbilityContext.Provider>
    )
  }
}

export default withDependencies<Dependencies>({
  authService: SYSTEM_LAYERS.auth.serviceName,
  authMapper: SYSTEM_LAYERS.auth.mapperName
})(App)
