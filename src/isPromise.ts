export default function isPromise(obj: any): obj is Promise<any> {
  return !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
} 