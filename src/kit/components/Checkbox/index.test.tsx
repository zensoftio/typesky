import * as React from 'react'
import {shallow} from 'enzyme'
import CheckBox from './index'
import {TESTS} from '../../../const/tests'

describe('CheckBox', () => {
  it('should render', () => {
    const component = shallow(<CheckBox onChange={() => {}} id={'test-id'}/>)
    const actual = component.html().includes(TESTS.HTML_TAGS.INPUT)
    expect(actual).toBeTruthy()
  })
})
