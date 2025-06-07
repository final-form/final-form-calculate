/**
 * This file is here to validate that the typings work correctly.
 */
import createDecorator from './index'

const decorator1 = createDecorator({
  field: 'foo',
  updates: {
    bar: (_allValues) => 'hello'
  }
})

const decorator2 = createDecorator({
  field: 'foo',
  updates: (_value, _field, _allValues) => ({ bar: 'hello' })
})

const decorator3 = createDecorator(
  {
    field: 'foo',
    updates: {
      bar: (value) => value + 'bar'
    }
  },
  {
    field: 'bar',
    updates: {
      baz: (value) => value + 'baz'
    }
  }
)

// Add basic tests to satisfy Jest
describe('TypeScript types', () => {
  it('should create decorators without type errors', () => {
    expect(typeof decorator1).toBe('function')
    expect(typeof decorator2).toBe('function')
    expect(typeof decorator3).toBe('function')
  })
})

export { decorator1, decorator2, decorator3 }
