import { createForm } from 'final-form'
import createDecorator from './decorator'

const onSubmitMock = () => {}
describe('decorator', () => {
  it('should update one field when another changes', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    const spy = jest.fn()
    const foo = jest.fn()
    const bar = jest.fn()
    form.subscribe(spy, { values: true })
    form.registerField('foo', foo, { value: true })
    form.registerField('bar', bar, { value: true })
    const decorator = createDecorator({
      field: 'foo',
      updates: {
        bar: fooValue => `${fooValue}bar`
      }
    })
    const unsubscribe = decorator(form)
    expect(typeof unsubscribe).toBe('function')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})

    expect(foo).toHaveBeenCalled()
    expect(foo).toHaveBeenCalledTimes(1)
    expect(foo.mock.calls[0][0].value).toBeUndefined()

    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(bar.mock.calls[0][0].value).toBeUndefined()

    // change foo (should trigger calculation on bar)
    form.change('foo', 'baz')

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[1][0].values).toEqual({ foo: 'baz' })
    expect(spy.mock.calls[2][0].values).toEqual({ foo: 'baz', bar: 'bazbar' })

    expect(foo).toHaveBeenCalledTimes(2)
    expect(foo.mock.calls[1][0].value).toBe('baz')

    expect(bar).toHaveBeenCalledTimes(2)
    expect(bar.mock.calls[1][0].value).toBe('bazbar')
  })

  it('should update one field when another changes, using regular expression', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    const spy = jest.fn()
    const foo = jest.fn()
    const bar = jest.fn()
    form.subscribe(spy, { values: true })
    form.registerField('foo', foo, { value: true })
    form.registerField('bar', bar, { value: true })
    const decorator = createDecorator({
      field: /f?o/,
      updates: {
        bar: fooValue => `${fooValue}bar`
      }
    })
    const unsubscribe = decorator(form)
    expect(typeof unsubscribe).toBe('function')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})

    expect(foo).toHaveBeenCalled()
    expect(foo).toHaveBeenCalledTimes(1)
    expect(foo.mock.calls[0][0].value).toBeUndefined()

    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(bar.mock.calls[0][0].value).toBeUndefined()

    // change foo (should trigger calculation on bar)
    form.change('foo', 'baz')

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[1][0].values).toEqual({ foo: 'baz' })
    expect(spy.mock.calls[2][0].values).toEqual({ foo: 'baz', bar: 'bazbar' })

    expect(foo).toHaveBeenCalledTimes(2)
    expect(foo.mock.calls[1][0].value).toBe('baz')

    expect(bar).toHaveBeenCalledTimes(2)
    expect(bar.mock.calls[1][0].value).toBe('bazbar')
  })

  it('should cease when unsubscribed', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    const spy = jest.fn()
    const foo = jest.fn()
    const bar = jest.fn()
    form.subscribe(spy, { values: true })
    form.registerField('foo', foo, { value: true })
    form.registerField('bar', bar, { value: true })
    const decorator = createDecorator({
      field: 'foo',
      updates: {
        bar: fooValue => `${fooValue}bar`
      }
    })
    const unsubscribe = decorator(form)
    expect(typeof unsubscribe).toBe('function')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})

    expect(foo).toHaveBeenCalled()
    expect(foo).toHaveBeenCalledTimes(1)
    expect(foo.mock.calls[0][0].value).toBeUndefined()

    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(bar.mock.calls[0][0].value).toBeUndefined()

    // change foo (should trigger calculation on bar)
    form.change('foo', 'baz')

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[1][0].values).toEqual({ foo: 'baz' })
    expect(spy.mock.calls[2][0].values).toEqual({ foo: 'baz', bar: 'bazbar' })

    expect(foo).toHaveBeenCalledTimes(2)
    expect(foo.mock.calls[1][0].value).toBe('baz')

    expect(bar).toHaveBeenCalledTimes(2)
    expect(bar.mock.calls[1][0].value).toBe('bazbar')

    // unsubscribe
    unsubscribe()

    // change foo again (should NOT trigger calculation on bar)
    form.change('foo', 'bazzy')

    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy.mock.calls[3][0].values).toEqual({ foo: 'bazzy', bar: 'bazbar' })

    expect(foo).toHaveBeenCalledTimes(3)
    expect(foo.mock.calls[2][0].value).toBe('bazzy')

    expect(bar).toHaveBeenCalledTimes(2)
  })

  it('should allow array summing', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    const spy = jest.fn()
    const total = jest.fn()
    const sum = jest.fn((itemValue, allValues) =>
      (allValues.items || []).reduce((sum, item) => sum + item, 0)
    )
    form.subscribe(spy, { values: true })
    form.registerField('items[0]', () => {}, {})
    form.registerField('items[1]', () => {}, {})
    form.registerField('items[2]', () => {}, {})
    form.registerField('total', total, { value: true })
    const decorator = createDecorator({
      field: /items\[\d+\]/,
      updates: { total: sum }
    })
    decorator(form)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})

    expect(total).toHaveBeenCalled()
    expect(total).toHaveBeenCalledTimes(1)
    expect(total.mock.calls[0][0].value).toBeUndefined()

    expect(sum).not.toHaveBeenCalled()

    // change first item value
    form.change('items[0]', 3)

    expect(sum).toHaveBeenCalled()
    expect(sum).toHaveBeenCalledTimes(1)

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[1][0].values).toEqual({ items: [3] })
    expect(spy.mock.calls[2][0].values).toEqual({ items: [3], total: 3 })

    // change second item value
    form.change('items[1]', 4)

    expect(sum).toHaveBeenCalled()
    expect(sum).toHaveBeenCalledTimes(2)

    expect(spy).toHaveBeenCalledTimes(5)
    expect(spy.mock.calls[3][0].values).toEqual({ items: [3, 4], total: 3 })
    expect(spy.mock.calls[4][0].values).toEqual({ items: [3, 4], total: 7 })

    // change third item value
    form.change('items[2]', 5)

    expect(sum).toHaveBeenCalled()
    expect(sum).toHaveBeenCalledTimes(3)

    expect(spy).toHaveBeenCalledTimes(7)
    expect(spy.mock.calls[5][0].values).toEqual({ items: [3, 4, 5], total: 7 })
    expect(spy.mock.calls[6][0].values).toEqual({ items: [3, 4, 5], total: 12 })
  })

  it('should allow separate array summing', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    const spy = jest.fn()
    const total = jest.fn()
    const sum = jest.fn((itemValue, allValues) =>
      (allValues.list[0].items || []).reduce((sum, item) => sum + item, 0)
    )
    form.subscribe(spy, { values: true })
    form.registerField('list[0].items[0]', () => {}, {})
    form.registerField('list[0].items[1]', () => {}, {})
    form.registerField('list[0].items[2]', () => {}, {})
    form.registerField('list[0].total', total, { value: true })
    const decorator = createDecorator({
      field: /\.items\[\d+\]/,
      updates: (name, value, all) => {
        const totalField = name.replace(/items\[[0-9]+\]/, 'total')
        return {
          [totalField]: sum(value, all)
        }
      }
    })
    decorator(form)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})

    expect(total).toHaveBeenCalled()
    expect(total).toHaveBeenCalledTimes(1)
    expect(total.mock.calls[0][0].value).toBeUndefined()

    expect(sum).not.toHaveBeenCalled()

    // change first item value
    form.change('list[0].items[0]', 3)

    expect(sum).toHaveBeenCalled()
    expect(sum).toHaveBeenCalledTimes(1)

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[1][0].values).toEqual({ list: [{ items: [3] }] })
    expect(spy.mock.calls[2][0].values).toEqual({
      list: [{ items: [3], total: 3 }]
    })

    // change second item value
    form.change('list[0].items[1]', 4)

    expect(sum).toHaveBeenCalled()
    expect(sum).toHaveBeenCalledTimes(2)

    expect(spy).toHaveBeenCalledTimes(5)
    expect(spy.mock.calls[3][0].values).toEqual({
      list: [{ items: [3, 4], total: 3 }]
    })
    expect(spy.mock.calls[4][0].values).toEqual({
      list: [{ items: [3, 4], total: 7 }]
    })

    // change third item value
    form.change('list[0].items[2]', 5)

    expect(sum).toHaveBeenCalled()
    expect(sum).toHaveBeenCalledTimes(3)

    expect(spy).toHaveBeenCalledTimes(7)
    expect(spy.mock.calls[5][0].values).toEqual({
      list: [{ items: [3, 4, 5], total: 7 }]
    })
    expect(spy.mock.calls[6][0].values).toEqual({
      list: [{ items: [3, 4, 5], total: 12 }]
    })
  })

  it('should notify form subscribers of updated values', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    const spy = jest.fn()
    const minimum = jest.fn()
    const maximum = jest.fn()
    const calcMax = jest.fn((minimumValue, allValues) =>
      Math.max(minimumValue || 0, allValues.maximum || 0)
    )
    const calcMin = jest.fn((maximumValue, allValues) =>
      Math.min(maximumValue || 0, allValues.minimum || 0)
    )
    form.subscribe(spy, { values: true })
    form.registerField('minimum', minimum, { value: true })
    form.registerField('maximum', maximum, { value: true })
    const decorator = createDecorator(
      {
        field: 'minimum', // when minimum changes...
        updates: {
          // ...update maximum to the result of this function
          maximum: calcMax
        }
      },
      {
        field: 'maximum', // when maximum changes...
        updates: {
          // update minimum to the result of this function
          minimum: calcMin
        }
      }
    )
    decorator(form)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})

    expect(minimum).toHaveBeenCalled()
    expect(minimum).toHaveBeenCalledTimes(1)
    expect(minimum.mock.calls[0][0].value).toBeUndefined()

    expect(maximum).toHaveBeenCalled()
    expect(maximum).toHaveBeenCalledTimes(1)
    expect(maximum.mock.calls[0][0].value).toBeUndefined()

    expect(calcMax).not.toHaveBeenCalled()
    expect(calcMin).not.toHaveBeenCalled()

    // change minimum
    form.change('minimum', 3)

    expect(calcMax).toHaveBeenCalled()
    expect(calcMax).toHaveBeenCalledTimes(1)
    expect(calcMin).toHaveBeenCalled()
    expect(calcMin).toHaveBeenCalledTimes(1)

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[1][0].values).toEqual({ minimum: 3 })
    expect(spy.mock.calls[2][0].values).toEqual({ minimum: 3, maximum: 3 })

    // raise maximum higher
    form.change('maximum', 5)

    expect(calcMin).toHaveBeenCalledTimes(2)

    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy.mock.calls[3][0].values).toEqual({ minimum: 3, maximum: 5 })

    form.change('maximum', 2)

    expect(calcMin).toHaveBeenCalledTimes(3)
    expect(calcMax).toHaveBeenCalledTimes(2)

    expect(spy).toHaveBeenCalledTimes(6)
    expect(spy.mock.calls[4][0].values).toEqual({ minimum: 3, maximum: 2 })
    expect(spy.mock.calls[5][0].values).toEqual({ minimum: 2, maximum: 2 })
  })
})
