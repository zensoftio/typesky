import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import * as mobx from 'mobx'

import App from './App'
// import {disposeInjection} from './common/annotations/common'
import {translationReady} from './common/translate'
// import {classLoader} from './common/class-loader'
import {dependencyRegistration} from './common/dependency-registration'

mobx.useStrict(true)

// classLoader()
dependencyRegistration()
  // .then(() => disposeInjection())
  .then(() => translationReady)
  .then(() => ReactDOM.render(
    <App/>,
    document.getElementById('root')
  ))

registerServiceWorker()
