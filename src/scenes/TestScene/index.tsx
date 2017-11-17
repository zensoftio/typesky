import * as React from 'react'
import './index.css'
import {Link} from 'react-router-dom'
import TodoListView from '../../components/todo-list'

interface Props {
  history: History
  location: any
  match: any
}

export class TestScene extends React.Component<Props, {}> {
  render() {
    return (
      <header>
        <h1>Hello World</h1>
        <TodoListView/>
        <Link to="/error">Error</Link>
      </header>
    )
  }
}
