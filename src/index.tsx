import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as mobx from 'mobx'
import App from './App'
import {Assembler, Container, ResolverProvider} from 'type-injector'
import ASSEMBLIES from './assemblies'
import {Resolver} from 'type-injector'
import './index.scss'
import './i18n'

mobx.configure({enforceActions: 'observed'})

const assembler = new Assembler(ASSEMBLIES, Container.defaultContainer)

assembler
  .assemble()
  .then((resolver: Resolver) => ReactDOM.render(
    (
      <ResolverProvider resolver={resolver}>
        <App/>
      </ResolverProvider>
    ),
    document.getElementById('root')
  ))
