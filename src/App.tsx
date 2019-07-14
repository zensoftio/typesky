import * as React from 'react';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {ComponentDependencies, withDependencies, WithDependencies} from './common/hoc/with-dependencies';
import {AuthService} from 'Services';
import {AccountMapper} from 'Mappers';
import {observer} from 'mobx-react';
import {ROUTES} from './routes';
import {renderRoutes} from 'react-router-config';
import './assets/styles/common.scss';

const history = createBrowserHistory();

interface AppDependencies extends ComponentDependencies {
  authService: AuthService;
  accountMapper: AccountMapper;
}

interface AppProps extends WithDependencies<AppDependencies> {
}

@observer
class App extends React.Component<AppProps> {
  render() {
    return (
      <Router history={history}>
        {renderRoutes(ROUTES)}
      </Router>
    )
  }
}

export default withDependencies({authService: 'AuthService', accountMapper: 'AccountMapper'})(App);


