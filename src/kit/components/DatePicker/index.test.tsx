import * as React from 'react'
import {shallow} from 'enzyme'
import {TESTS} from '../../../const/tests'
import DatePickerComponent from './index'

describe('DatePickerComponent', () => {
  it('should render', () => {
    const component = shallow(<DatePickerComponent value={new Date()} onChange={() => {}} />)
    const actual = component.html().includes(TESTS.HTML_TAGS.DIV)
    expect(actual).toBeTruthy()
  })

  it('should correct call "onFocus" method', () => {
    const component = shallow<DatePickerComponent>(<DatePickerComponent value={new Date()} onChange={() => {}} />)
    component.instance().toggleFocus()
    const actual = component.instance().isFocused === true
    expect(actual).toBeTruthy()
  })
})
