import * as React from 'react'
import {shallow} from 'enzyme'
import Radio from './index'

describe('Radio component Module', () => {
  const mockProps = {
    title: 'Test',
    field: {
      name: 'name'
    },
    options: [
      {value: '1', label: 'test1'},
      {value: '2', label: 'test2'},
    ]
  }

  it('should render', () => {
    const component = shallow(<Radio {...mockProps} />)
    const wrapper = component.find('.radio')
    expect(wrapper).toBeTruthy()
  })

  it('should render title', () => {
    const component = shallow(<Radio {...mockProps} />)
    const title = component.find('.radio__title').text()
    expect(title).toBe(mockProps.title)
  })

  it('should render correct number of radios', () => {
    const component = shallow(<Radio {...mockProps} />)
    const radioCount = component.find('.radio__item')
    expect(radioCount).toHaveLength(mockProps.options.length)
  })

  it('should render inputs', () => {
    const component = shallow(<Radio {...mockProps} />)
    const radioCount = component.find('.radio__input')
    expect(radioCount).toHaveLength(mockProps.options.length)
  })

  it('should render label', () => {
    const component = shallow(<Radio {...mockProps} />)
    const label = component.find('.radio__label').last().text()
    expect(label).toBe(mockProps.options[mockProps.options.length - 1].label)
  })
})
