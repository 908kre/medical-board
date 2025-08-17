import { mergeWith } from "lodash-es";
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
export const Merge = <T>() => {
  return (a: T, b: DeepPartial<T>): T => {
    return mergeWith({}, a, b, (objValue, srcValue, key, obj) => {
      // if the value is undefined, replace it with the source value
      if (objValue !== srcValue && typeof srcValue === "undefined") {
        obj[key] = srcValue;
      }
      // if the value is an array, replace it
      else if (Array.isArray(srcValue)) {
        return srcValue;
      }
    });
  };
};
