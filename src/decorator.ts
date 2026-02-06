import type { Decorator, FormApi } from 'final-form'
import type { Calculation, Updates } from './types'
import { getIn } from 'final-form'
import isPromise from './isPromise'

const tripleEquals = (a: any, b: any) => a === b
const createDecorator = <FormValues extends Record<string, any> = Record<string, any>>(
  ...calculations: Calculation[]
): Decorator<FormValues> => (form: FormApi<FormValues>) => {
  let previousValues: FormValues | undefined
  const unsubscribe = form.subscribe(
    ({ values }) => {
      form.batch(() => {
        const runUpdates = (
          field: string,
          isEqual: (a: any, b: any) => boolean,
          updates: Updates
        ) => {
          const next = values && getIn(values, field)
          const previous = previousValues && getIn(previousValues, field)
          if (!isEqual(next, previous)) {
            if (typeof updates === 'function') {
              const results = updates(next, field, values, previousValues)
              if (isPromise(results)) {
                results.then(resolved => {
                  Object.keys(resolved).forEach(destField => {
                    form.change(destField, resolved[destField])
                  })
                })
              } else {
                Object.keys(results).forEach(destField => {
                  form.change(destField, results[destField])
                })
              }
            } else {
              Object.keys(updates).forEach(destField => {
                const update = updates[destField]
                const result = update(next, values, previousValues)
                if (isPromise(result)) {
                  result.then(resolved => {
                    form.change(destField, resolved)
                  })
                } else {
                  form.change(destField, result)
                }
              })
            }
          }
        }
        const fields = form.getRegisteredFields()
        calculations.forEach(
          ({ field, isEqual, updates, updateOnPristine = true }) => {
            if (typeof field === 'string') {
              if (
                updateOnPristine ||
                !form.getFieldState(field)?.pristine
              ) {
                runUpdates(field, isEqual || tripleEquals, updates)
              }
            } else {
              // field is a either array or regex
              const matches = Array.isArray(field)
                ? (name: string) =>
                    ~field.indexOf(name) ||
                    field.findIndex(
                      f => f instanceof RegExp && (f as RegExp).test(name)
                    ) !== -1
                : (name: string) => (field as RegExp).test(name)
              fields.forEach(fieldName => {
                if (matches(fieldName)) {
                  if (
                    updateOnPristine ||
                    !form.getFieldState(fieldName)?.pristine
                  ) {
                    runUpdates(fieldName, isEqual || tripleEquals, updates)
                  }
                }
              })
            }
          }
        )
        previousValues = values
      })
    },
    { values: true }
  )
  return unsubscribe
}

export default createDecorator