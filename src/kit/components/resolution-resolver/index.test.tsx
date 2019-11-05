import * as React from 'react'
import {shallow} from 'enzyme'
import ResolutionResolver from './index'
import {TESTS} from '../../../const/tests'

describe('App', () => {
  it('should render', () => {
    const component = shallow<ResolutionResolver>(
      <ResolutionResolver mobile={<div />} desktop={<div />}/>
    )
    const actual = component.html().includes(TESTS.HTML_TAGS.DIV)
    expect(actual).toBeTruthy()
  })
})
