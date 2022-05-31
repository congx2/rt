
export const getString = value => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

export const hasOwnKey = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export const isPrimitive = value => {
  if (value === null) {
    return true
  }
  const type = typeof value
  return type !== 'function' && type !== 'object'
}

const cloneEachProp = (target, source, circularRefMap = new WeakMap()) => {
  
}

export const deepClone = (value) => {
  const circularRefMap = new WeakMap()

  const cloneEachOwnProp = (target, source) => {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const value = source[key]
        if (!circularRefMap.has(value)) {
          circularRefMap.set(value, value)
        }
        target[key] = circularRefMap.get(value)
      }
    }
    return target
  }

  const each = (obj, fn) => {
    if (typeof fn !== 'function') {
      return
    }
    for (const key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && fn(obj[key], key, obj)
    }
  }

  const clone = (value) => {
    if (isPrimitive(value)) {
      return value
    }
    const stringTag = getString(value)
    const tags = ['String', 'Number', 'Boolean', 'Date']
    if (tags.indexOf(stringTag) !== -1) {
      const Ctor = value.constructor
      return new Ctor(value.valueOf())
    }
    if (stringTag === 'RegExp') {
      const source = value.source
      const flags = value.toString().split('/').pop()
      const cloneReg = new RegExp(source, flags)
      return cloneEachOwnProp(cloneReg, value)
    }
    if (stringTag === 'Array' || stringTag === 'Object') {
      const clone = Array.isArray(value) ? [] : Object.create(value.prototype)
      each(value, (value, key) => {
        if (circularRefMap.has(value)) {
          clone[key] = circularRefMap.get(value)
        } else {
          circularRefMap.set(value, clone)
          clone[key] = clone(value)
        }
      })
    }
  }
  return clone(value)
}


