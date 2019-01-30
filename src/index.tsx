import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import * as mobx from 'mobx'

import App from './App'
import {translationReady} from './common/translate'
import {dependencyRegistration} from './common/dependency-registration'

mobx.useStrict(true)

dependencyRegistration()
  .then(() => translationReady)
  .then(() => ReactDOM.render(
    <App/>,
    document.getElementById('root')
  ))

registerServiceWorker()
