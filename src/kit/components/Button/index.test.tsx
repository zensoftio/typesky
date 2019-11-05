import * as React from 'react'
import {shallow} from 'enzyme'
import {Button} from './index'
import {TESTS} from '../../../const/tests'

describe('Button', () => {
  it('should render', () => {
    const component = shallow<Button>(<Button><div className={TESTS.CONTENT.TEXT1} /></Button>)
    const actual = component.html().includes(TESTS.CONTENT.TEXT1)
    expect(actual).toBeTruthy()
  })
})
