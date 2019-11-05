import * as React from 'react'
import {shallow, ShallowWrapper, mount} from 'enzyme'
import {InputMultipleFilter} from './index'

describe('InputMultipleFilter component', () => {
    let component: ShallowWrapper
    const mockedProps = {
        onUpdate: () => jest.fn(),
        onReset: () => jest.fn(),
        filterName: 'test',
        label: 'testLabel',
    }
    beforeEach(() => {
        component = shallow(<InputMultipleFilter {...mockedProps} />)
    })
    it('should render component ', () => {
        const item = component.find('.multiple-filter__wrapper')
        expect(item).toHaveLength(1)
    })
    it('should render correct label ', () => {
        const label = component.find('.multiple-filter__form-label').text()
        expect(label).toMatch(mockedProps.label)
    })
    it('should render input', () => {
        const field = component.find('.multiple-filter__form-input')
        expect(field).toBeTruthy()
    })
    it('should call addFilter on Submit', () => {
        const wrapper = mount(<InputMultipleFilter {...mockedProps} />)
        const instance = wrapper.instance() as InputMultipleFilter
        const spy = jest.spyOn(instance, 'addFilter')
        wrapper.simulate('submit')
        expect(spy).toBeTruthy()
    })
    it('should add 1 filter on Submit', () => {
        const wrapper = mount(<InputMultipleFilter {...mockedProps} />)
        const instance = wrapper.instance() as InputMultipleFilter
        wrapper.update()
        wrapper.find('.multiple-filter__form-input')
            .simulate('change', { target: { value: 'Test1' } })
        wrapper.find('.multiple-filter__form')
            .simulate('submit')
        expect(instance.currentFilters.length).toEqual(1)
    })
    it('should remove filter on Submit', () => {
        const wrapper = mount(<InputMultipleFilter {...mockedProps} />)
        const instance = wrapper.instance() as InputMultipleFilter
        instance.currentFilters = ['test 1', 'test 2']
        wrapper.update()
        wrapper.find('.multiple-filter__current-item-remove').first()
            .simulate('click')
        expect(instance.currentFilters.length).toEqual(1)
    })
})
