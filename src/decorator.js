// @flow
import type { Decorator, FormApi, FormValuesShape } from 'final-form'
import type { Calculation, Updates } from './types'
import { getIn } from 'final-form'
import isPromise from './isPromise'

const tripleEquals = (a: any, b: any) => a === b
const createDecorator = <FormValues: FormValuesShape>(
  ...calculations: Calculation[]
): Decorator<FormValues> => (form: FormApi<FormValues>) => {
  let previousValues = {}
  const unsubscribe = form.subscribe(
    ({ values }) => {
      form.batch(() => {
        const runUpdates = (
          field: string,
          isEqual: (any, any) => boolean,
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
        calculations.forEach(({ field, isEqual, updates }) => {
          if (typeof field === 'string') {
            runUpdates(field, isEqual || tripleEquals, updates)
          } else {
            // field is a either array or regex
            const matches = Array.isArray(field)
              ? name =>
                  ~field.indexOf(name) ||
                  field.findIndex(
                    f => f instanceof RegExp && (f: RegExp).test(name)
                  ) !== -1
              : name => (field: RegExp).test(name)
            fields.forEach(fieldName => {
              if (matches(fieldName)) {
                runUpdates(fieldName, isEqual || tripleEquals, updates)
              }
            })
          }
        })
        previousValues = values
      })
    },
    { values: true }
  )
  return unsubscribe
}

export default createDecorator
