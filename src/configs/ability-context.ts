import {createContext} from 'react'
import {createContextualCan} from '@casl/react'
import {Ability} from '@casl/ability'

export const AbilityContext = createContext(new Ability())
export const Can = createContextualCan(AbilityContext.Consumer)
