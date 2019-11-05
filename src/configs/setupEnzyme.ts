import {configure} from 'enzyme'
import * as EnzymeAdapter from 'enzyme-adapter-react-16'
configure({adapter: new EnzymeAdapter()})

/**
 * fix: `matchMedia` not present, legacy browsers require a polyfill
 */
window.matchMedia = window.matchMedia || (
  () => {
    return {
      matches : false,
      addListener : () => {},
      removeListener: () => {}
    }
  }
)
