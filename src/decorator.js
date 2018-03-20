// @flow
import type { Decorator, FormApi } from 'final-form'
import type { Calculation, Updates } from './types'
import { getIn } from 'final-form'

const tripleEquals = (a: any, b: any) => a === b
const createDecorator = (...calculations: Calculation[]): Decorator => (
  form: FormApi
) => {
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
              const results = updates(next, field, values)
              Object.keys(results).forEach(destField => {
                form.change(destField, results[destField])
              })
            } else {
              Object.keys(updates).forEach(destField => {
                const update = updates[destField]
                form.change(destField, update(next, values))
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
              ? name => ~field.indexOf(name)
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
