import * as React from 'react'
import {shallow} from 'enzyme'
import {TextAreaField} from './index'
import {TESTS} from '../../../const/tests'

describe('Text area field', () => {
  const mockValue = 'test'
  it('should render', () => {
    const component = shallow<TextAreaField>(<TextAreaField name={mockValue} value={mockValue} onChange={() => jest.fn()} />)
    const actual = component.html().includes(TESTS.HTML_TAGS.DIV)
    expect(actual).toBeTruthy()
  })
})
