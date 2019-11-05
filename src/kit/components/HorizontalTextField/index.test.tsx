import * as React from 'react'
import {HorizontalTextField} from './index'
import {shallow} from 'enzyme'

describe('HorizontalTextField component', () => {
  const mockProps = {
    label: 'Test',
    name: 'test',
    disabled: true,
    value: '123'
  }

  it('should render', () => {
    const component = shallow(<HorizontalTextField {...mockProps}  />)
    const wrapper = component.find('.ht-field__content')
    expect(wrapper).toBeTruthy()
  })

  it('should render label', () => {
    const component = shallow(<HorizontalTextField {...mockProps}  />)
    const label = component.find('.ht-field__label').text()
    expect(label).toEqual(mockProps.label)
  })

  it('should render input with value', () => {
    const component = shallow(<HorizontalTextField {...mockProps}  />)
    const value = component.find('.ht-field__input').prop('value')
    expect(value).toEqual(mockProps.value)
  })
})
