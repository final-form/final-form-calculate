// @flow
import type { Decorator, FormApi } from 'final-form'
import type { Calculation, Updates } from './types'
import { getIn } from 'final-form'

const createDecorator = (...calculations: Calculation[]): Decorator => (
  form: FormApi
) => {
  let previousValues = {}
  const unsubscribe = form.subscribe(
    ({ values }) => {
      form.batch(() => {
        const runUpdates = (field: string, updates: Updates) => {
          const next = getIn(values, field)
          const previous = getIn(previousValues, field)
          if (next !== previous) {
            Object.keys(updates).forEach(destField => {
              const update = updates[destField]
              form.change(destField, update(next, values))
            })
          }
        }
        const fields = form.getRegisteredFields()
        calculations.forEach(({ field, updates }) => {
          if (typeof field === 'string') {
            runUpdates(field, updates)
          } else {
            // field is a regex
            const regex = (field: RegExp)
            fields.forEach(fieldName => {
              if (regex.test(fieldName)) {
                runUpdates(fieldName, updates)
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
