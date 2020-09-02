import createDecorator from './'

createDecorator(
  {
    field: 'foo',
    updates: {
      bar: (value, allValues) => {
        return value
      },
      baz: (value, allValues) => {
        return value
      },
    },
  },
  {
    field: ['bar', 'baz'],
    updates: (value, field, allValues) => {
      return { ...allValues }
    },
  },
  {
    field: /ba/,
    isEqual: (a, b) => a === b,
    updates: (value, field, allValues) => {
      return { ...allValues }
    },
  },
  {
    field: ['foo', /ba/],
    updates: (value, field, allValues) => {
      return { ...allValues }
    }
  }
)
