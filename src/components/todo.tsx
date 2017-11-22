import * as React from 'react'
import {observer} from 'mobx-react'
import TodoModel from '../models/todo'

const TodoView = observer(({todo, onClick}: { todo: TodoModel, onClick: () => void }) => (
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
