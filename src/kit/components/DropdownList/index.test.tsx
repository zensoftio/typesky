import * as React from 'react'
import {shallow, ShallowWrapper} from 'enzyme'
import DropdownList from './index'

describe('DropdownList component', () => {
  let component: ShallowWrapper
  const mockProps = {
    header: <span>Header Test</span>,
    content: <span>Content</span>
  }

  beforeEach(() => {
    component = shallow(<DropdownList {...mockProps} />)
  })

  it('should render', () => {
    const wrapper = component.find('.dropdown-list')
    const expected = 1
    expect(wrapper).toHaveLength(expected)
  })

  it('should render header with given span', () => {
    const text = component.find('.dropdown-list__header').find('span').text()
    expect(text).toEqual('Header Test')
  })
})
