import { Decorator } from 'final-form'

export type FieldName = string

export type FieldPattern = FieldName | RegExp | (FieldName | RegExp)[]

export type UpdatesByName = {
  [FieldName: string]: (_value: any, _allValues?: Object, _prevValues?: Object) => any
}

export type UpdatesForAll = (
  _value: any,
  _field: string,
  _allValues?: Object,
  _prevValues?: Object,
) => { [FieldName: string]: any }

export type Updates = UpdatesByName | UpdatesForAll

export type Calculation = {
  field: FieldPattern,
  updates: Updates,
  isEqual?: (_a: any, _b: any) => boolean,
}

export default function createDecorator<FormValues = object>(
  ..._calculations: Calculation[]
): Decorator<FormValues>
