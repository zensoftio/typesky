import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import * as mobx from 'mobx'

import App from './App'

mobx.useStrict(true)

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
registerServiceWorker()