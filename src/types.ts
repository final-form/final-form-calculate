type FieldName = string
export type FieldPattern = FieldName | RegExp | (FieldName | RegExp)[]
export type UpdatesByName = {
  [key: string]: (_value: any, _allValues?: Record<string, any> | null, _prevValues?: Record<string, any> | null) => any
}
export type UpdatesForAll = (
  _value: any,
  _field: string,
  _allValues?: Record<string, any> | null,
  _prevValues?: Record<string, any> | null
) => { [key: string]: any }
export type Updates = UpdatesByName | UpdatesForAll

export type Calculation = {
  field: FieldPattern,
  isEqual?: (_a: any, _b: any) => boolean,
  updates: Updates
} 