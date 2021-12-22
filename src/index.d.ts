import { Decorator } from 'final-form'

export type FieldName = string

export type FieldPattern = FieldName | RegExp | (FieldName | RegExp)[]

export type UpdatesByName<T> = {
  [FieldName: string]: (value: any, allValues?: T, prevValues?: T) => any
}

export type UpdatesForAll<T> = (
  value: T[keyof T],
  field: string,
  allValues?: T,
  prevValues?: T
) => { [FieldName: string]: any }

export type Updates<T> = UpdatesByName<T> | UpdatesForAll<T>

export type Calculation<T extends object = Object> = {
  field: FieldPattern
  updates: Updates<T>
  isEqual?: (a: any, b: any) => boolean
}

export default function createDecorator<T extends Object>(
  ...calculations: Calculation<T>[]
): Decorator
