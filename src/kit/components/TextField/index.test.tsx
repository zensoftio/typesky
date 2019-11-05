import * as React from 'react'
import {shallow} from 'enzyme'
import {TextField} from './index'
import {TESTS} from '../../../const/tests'

describe('ModuleHeader', () => {
  it('should render', () => {
    const component = shallow<TextField>(
      <TextField i18n={{} as any} t={() => {}} tReady={false} value={''} label={'label'} onChange={() => {}}/>)
    const actual = component.html().includes(TESTS.HTML_TAGS.DIV)
    expect(actual).toBeTruthy()
  })
})
