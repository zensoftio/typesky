import * as React from 'react'
import {observer} from 'mobx-react'
import Todo from '../models/todo'

interface Props {
  todo: Todo.Model,
  onClick: () => void
}

const TodoView = observer(({todo, onClick}: Props) => (
  <li>
    <input
      type="checkbox"
      checked={todo.finished}
      onClick={onClick}
      readOnly={true}
    />{todo.title}
  </li>
))

export default TodoView
