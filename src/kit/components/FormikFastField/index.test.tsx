import * as React from 'react'
import {shallow} from 'enzyme'
import FormikFastField from './FormikFastField'
import {TESTS} from '../../../const/tests'

describe('FormikFastField', () => {
  it('should render', () => {
    const component = shallow(<FormikFastField render={() => <div/>} value={''}/>)
    const actual = component.html().includes(TESTS.HTML_TAGS.DIV)
    expect(actual).toBeTruthy()
  })

  it('should correct handleChange method', () => {
    const component = shallow<FormikFastField>(<FormikFastField render={() => <div/>} value={TESTS.CONTENT.TEXT1}/>)
    const actual = component.instance().localValue === TESTS.CONTENT.TEXT1
    expect(actual).toBeTruthy()
  })

  it('should correct handleChange method', () => {
    const component = shallow<FormikFastField>(<FormikFastField render={() => <div/>} value={''}/>)
    component.instance().handleChange({target: {value: TESTS.CONTENT.TEXT1}} as React.ChangeEvent<any>)
    const actual = component.instance().localValue === TESTS.CONTENT.TEXT1
    expect(actual).toBeTruthy()
  })

  it('should correct setFieldValue method', () => {
    const component = shallow<FormikFastField>(<FormikFastField render={() => <div/>} value={''}/>)
    component.instance().setFieldValue(TESTS.CONTENT.TEXT1)
    const actual = component.instance().localValue === TESTS.CONTENT.TEXT1
    expect(actual).toBeTruthy()
  })
})
