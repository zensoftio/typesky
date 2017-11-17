import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import * as mobx from 'mobx'

import App from './App'
import {disposeInjection} from './annotations/common'

require('./stores/index')
require('./services/index')
require('./repositories/index')

mobx.useStrict(true)

disposeInjection()

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
registerServiceWorker()