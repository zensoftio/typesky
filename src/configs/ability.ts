import {AbilityBuilder} from '@casl/ability'
import {CurrentUser} from '@Entities/auth'

export default function defineAbilitiesFor(currentUser?: CurrentUser) {
    return AbilityBuilder.define((can: Function) => {
        if (currentUser) {
            can('view', currentUser.role)
        }
    })
}
