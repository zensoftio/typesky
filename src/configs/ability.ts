import {AbilityBuilder} from '@casl/ability';
import {Account} from '../models/account';

export default function defineAbilitiesFor(account: Account.CurrentUser) {

  return AbilityBuilder.define((can: Function, cannot: Function) => {

    account.permissions.forEach((permission) => {
        can('view', permission)
      }
    )
  })
}
