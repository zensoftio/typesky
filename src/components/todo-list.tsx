import TodoView from './todo'
import * as React from 'react'
import {observer} from 'mobx-react'
import Todo from '../models/todo'
import {PostService, TodoService} from '../services'
import {PostMapper, TodoMapper} from '../mappers'
import {instanceRegistry} from '../common/annotations/common'
import Post from '../models/post'
import {action, computed, observable} from 'mobx'
import Changeset from '../common/changeset'
import ChangesetValidations from '../common/changeset-validations'

type ReadonlyPostFields = 'userId' | 'id'

type EditablePostFields = 'title' | 'body'

@observer
export default class TodoListView extends React.Component<{}, {}> {

  // fields

  private postId = 1

  private todoService: TodoService = instanceRegistry.get('TodoService')
  private postService: PostService = instanceRegistry.get('PostService')
  private todoMapper: TodoMapper = instanceRegistry.get('TodoMapper')
  private postMapper: PostMapper = instanceRegistry.get('PostMapper')

  @computed
  private get changeset(): Changeset.Changeset<Post.Model, EditablePostFields, ReadonlyPostFields> | undefined {

    const post = this.postMapper.postById

    return post && new Changeset.Changeset<Post.Model, EditablePostFields, ReadonlyPostFields>(
      post,
      {
        title: ChangesetValidations.validateLength('Title', {min: 10, max: 50}),
        body: ChangesetValidations.validateLength('Title', {min: 50})
      },
      [
        'userId',
        'id'
      ],
      true
    )
  }

  // constructor

  // life circle

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
    const todoLast = this.todoMapper.lastOne
    const single = this.postMapper.postById

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
              <div>Edit post #{changeset.proxy.id} by user #{changeset.proxy.userId}</div>
              <div>
                <input value={changeset.fields.title.value || ''}
                       onChange={action((e: React.ChangeEvent<HTMLInputElement>) => {
                         changeset.fields.title.value = e.target.value
                       })}/>
                {changeset.fields.title.error && (<span>{changeset.fields.title.error}</span>)}
              </div>
              <div>
                <input value={changeset.fields.body.value || ''}
                       onChange={action((e: React.ChangeEvent<HTMLInputElement>) => {
                         changeset.fields.body.value = e.target.value
                       })}/>
                {changeset.fields.body.error && (<span>{changeset.fields.body.error}</span>)}
              </div>
            </div>
          )}
        </div>
        <ul>

          {this.todoMapper.all.map(todo =>
            <TodoView todo={todo} key={todo.id} onClick={() => this.onTodoCheckboxClick(todo)}/>
          )}

          {todoLast && <TodoView todo={todoLast} key={todoLast.id} onClick={() => this.onTodoCheckboxClick(todoLast)}/>}

        </ul>
        Tasks left: {this.todoMapper.unfinishedTodoCount}
      </div>
    )
  }

  // private methods

  private create() {
    this.todoService.createNew()
  }

  private toggleCheckbox(todo: Todo.Model) {
    this.todoService.toggleTodo(todo)
  }

  private loadPost() {
    this.postId++
    return this.postService.loadPost(this.postId)
  }
}
