import {computed, observable} from 'mobx'
import {attr} from '../common/annotations/model'
import defineAbilitiesFor from '../../configs/ability'

export namespace Account {

  export class BaseModel {
    @attr()
    @observable
    id: number

    @attr()
    @observable
    firstName: string

    @attr()
    @observable
    lastName: string

    @attr()
    @observable
    email: string

    @attr()
    @observable
    accountType: string

    @attr({optional: true, defaultValue: true})
    @observable
    enabled: boolean

    @computed
    get name() {
      return `${this.firstName} ${this.lastName}`
    }
  }

  export class CurrentUser {
    @attr()
    @observable
    id: number

    @attr()
    @observable
    account: BaseModel

    @attr({type: String, defaultValue: []})
    @observable
    permissions: string[]

    can = (action: string, subject: any, field?: string) => {
      return this.abilities.can(action, subject, field)
    }

    @computed
    get abilities() {
      return defineAbilitiesFor(this)
    }
  }

  export interface Records {
    currentUser: CurrentUser;
  }
}
