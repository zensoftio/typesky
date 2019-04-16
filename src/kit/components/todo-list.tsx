import TodoView from './todo'
import * as React from 'react'
import {observer} from 'mobx-react'
import Todo from '../../models/todo'
import {PostService, TodoService} from '../../services'
import {PostMapper, TodoMapper} from '../../mappers'

import Post from '../../models/post'
import {action, computed} from 'mobx'
import Changeset from '../../common/changeset'
import ChangesetValidations from '../../common/changeset-validations'
import {ComponentDependencies, withDependencies, WithDependencies} from '../../common/hoc/with-dependencies'

type ReadonlyPostFields = 'userId' | 'id'

type EditablePostFields = 'title' | 'body'

interface Dependencies extends ComponentDependencies {
  todoService: TodoService
  postService: PostService
  todoMapper: TodoMapper
  postMapper: PostMapper
}

interface Props extends WithDependencies<Dependencies> {

}

@observer
export class TodoListView extends React.Component<Props, {}> {

  // fields
  private postId: number

  @computed
  private get changeset(): Changeset.Changeset<Post.Model, EditablePostFields, ReadonlyPostFields> | undefined {

    const post = this.props.deps.postMapper.postById

    return post && new Changeset.Changeset<Post.Model, EditablePostFields, ReadonlyPostFields>({
      hostObject: post,
      rules: {
        title: ChangesetValidations.validateLength('Title', {min: 10, max: 50}),
        body:
          ChangesetValidations.validateLength('Title', {min: 50})
      },
      proxyFields: [
        'userId',
        'id'
      ],
      validateAutomatically: true
    })
  }

  awakeAfterInjection() {

  }

  componentDidMount() {
    this.loadPost()
  }

  // handlers

  onCreateNewButtonClick = () => {
    this.create()
  }

  onTodoCheckboxClick = (todo: Todo.Model) => {
    this.toggleCheckbox(todo)
  }

  onReloadPostButtonClick = () => {
    this.loadPost()
  }

  // render

  render() {
    const todoLast = this.props.deps.todoMapper.lastOne
    const single = this.props.deps.postMapper.postById

    const changeset = this.changeset

    return (
      <div>
        <button onClick={this.onCreateNewButtonClick}>create new</button>
        <button onClick={this.onReloadPostButtonClick}>reload post</button>
        <div>
          {single && (
            <div key={single.id}>
              <div>{single.title}</div>
              <div>{single.body}</div>
              <div>{single.userId}</div>
            </div>
          )}
          {changeset && (
            <div>
              <div>Edit post #{changeset.context.id} by user #{changeset.context.userId}</div>
              <div>
                <input value={changeset.fields.title.value || ''}
                       onChange={action((e: React.ChangeEvent<HTMLInputElement>) => {
                         changeset.fields.title.value = e.target.value
                       })}/>
                {changeset.fields.title.isInvalidAndDirty && (
                  <span>{changeset.fields.title.validationResult!.error}</span>)}
              </div>
              <div>
                <input value={changeset.fields.body.value || ''}
                       onChange={action((e: React.ChangeEvent<HTMLInputElement>) => {
                         changeset.fields.body.value = e.target.value
                       })}/>
                {changeset.fields.body.isInvalidAndDirty && (
                  <span>{changeset.fields.body.validationResult!.error}</span>)}
              </div>
            </div>
          )}
        </div>
        <ul>

          {this.props.deps.todoMapper.all.map(todo =>
            <TodoView todo={todo} key={todo.id} onClick={() => this.onTodoCheckboxClick(todo)}/>
          )}

          {todoLast && <TodoView todo={todoLast} key={todoLast.id} onClick={() => this.onTodoCheckboxClick(todoLast)}/>}

        </ul>
        Tasks left: {this.props.deps.todoMapper.unfinishedTodoCount}
      </div>
    )
  }

  // private methods

  private create() {
    this.props.deps.todoService.createNew()
  }

  private toggleCheckbox(todo: Todo.Model) {
    this.props.deps.todoService.toggleTodo(todo)
  }

  private loadPost() {
    this.postId++
    return this.props.deps.postService.loadPost(this.postId)
  }
}

export default withDependencies<Dependencies>({
  todoService: 'TodoService',
  postService: 'PostService',
  todoMapper: 'TodoMapper',
  postMapper: 'PostMapper'
})(TodoListView)
