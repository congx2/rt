

import { useState } from "react";


export const useDeepCloneState = <T>(value: T): [T, (v: T) => void] => {
  const [val, setVal] = useState(value)
  const setCloneVal = value => {
    if (value === null) {
      return setVal(null)
    }
    if (typeof value !== 'function' && typeof value !== 'object') {
      return setVal(value)
    }
    setVal(JSON.parse(JSON.stringify(value)))
  }
  return [val, setCloneVal]
}
