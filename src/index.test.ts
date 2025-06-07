import createDecorator from './index'
import decoratorDefault from './decorator'
import * as indexModule from './index'
import { createForm } from 'final-form'

const onSubmitMock = () => { }

describe('index module', () => {
  it('should export the decorator function from index', () => {
    expect(typeof createDecorator).toBe('function')

    // Verify that the re-export is working correctly
    expect(createDecorator).toBe(decoratorDefault)

    // Test namespace import as well
    expect(indexModule.default).toBe(decoratorDefault)

    // Test that the exported function works
    const form = createForm({ onSubmit: onSubmitMock })
    const decorator = createDecorator({
      field: 'test',
      updates: {
        result: value => value ? 'success' : 'fail'
      }
    })

    const unsubscribe = decorator(form)
    expect(typeof unsubscribe).toBe('function')
    unsubscribe()
  })

  it('should have proper default export from index module', () => {
    // This test ensures the default export line is executed
    const exported = indexModule.default
    expect(exported).toBeDefined()
    expect(typeof exported).toBe('function')
  })
}) 