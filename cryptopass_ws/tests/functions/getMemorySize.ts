import v8 from "v8";

export function getObjectSize<T>(obj: T) {
  return v8.serialize(obj).length;
}
