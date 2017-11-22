import * as React from 'react'
import {observer} from 'mobx-react'
import TodoModel from '../models/todo'

interface Props {
  todo: TodoModel,
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
