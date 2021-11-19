
import { useState } from "react"

type HookType<T> = [T | undefined, () => void];

export const usePromise = <T>(promiseFn: () => PromiseLike<T>): HookType<T> => {
  const [value, setValue] = useState<T>();
  const resolveValue = () => promiseFn().then(result => setValue(result));
  return [ value, resolveValue ];
}