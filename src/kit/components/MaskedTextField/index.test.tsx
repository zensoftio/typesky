import * as React from 'react'
import {shallow} from 'enzyme'
import {MaskedTextField} from './index'
import {TESTS} from '../../../const/tests'

describe('MaskedTextFieldMaskedTextField', () => {
  it('should render', () => {
    const component = shallow<MaskedTextField>(<MaskedTextField mask={['']} value={''} label={'label'} onChange={() => {}}/>)
    const actual = component.html().includes(TESTS.HTML_TAGS.DIV)
    expect(actual).toBeTruthy()
  })
})
