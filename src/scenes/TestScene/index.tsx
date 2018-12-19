import * as React from 'react'
import './index.css'
import {Link} from 'react-router-dom'
import TodoListView from '../../kit/components/todo-list'
import i18n from '../../common/translate'
import BaseScene from '../BaseScene'

export class TestScene extends BaseScene {
  render() {
    return (
      <header>
        <h1>{i18n.t('some.key')}</h1>
        <h1>Hello World</h1>
        <TodoListView/>
        <Link to="/error">Error</Link>
      </header>
    )
  }
}
