import { DeepPartial } from "../models/models";

export function isEmptyObject(obj: any) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) 
        && Object.keys(obj).length === 0;
}

export function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key];
      const sourceValue = source[key];    
      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
          targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } 
      else if (Array.isArray(sourceValue)) {
        result[key] = [...sourceValue] as any;
      }
      else {
        result[key] = sourceValue as any;
      }
    }
  }   
  return result;
}
