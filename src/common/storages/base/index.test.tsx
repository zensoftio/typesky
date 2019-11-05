import * as React from 'react'
import DefaultRecordStorage from './default'

interface TestRecord {
  testStore: 'test' | 'test default value'
}

describe('DefaultRecordStorage', () => {

  it('should correct setter or getter', () => {
    const store = new DefaultRecordStorage<TestRecord>()
    store.set('testStore', 'test')
    const actual = store.get('testStore')
    expect(actual).toBeTruthy()
  })

  it('should correct setter or getWithDefault method', () => {
    const store = new DefaultRecordStorage<TestRecord>()
    store.set('testStore', 'test')
    const actual = store.getWithDefault('testStore', 'test default value')
    expect(actual).toBeTruthy()
  })

  it('should correct setter or getContainer method', () => {
    const store = new DefaultRecordStorage<TestRecord>()
    store.set('testStore', 'test')
    const actual = store.getContainer('testStore')._
    expect(actual).toEqual('test')
  })
})
