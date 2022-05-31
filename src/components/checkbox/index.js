import React, { useState, useEffect } from "react"
import './index.css'

const Checkbox = props => {

  const apply = (cb, ...args) => {
    return typeof cb === 'function' ? cb(...args) : undefined
  }

  const { checked, children } = props

  const onClick = () => {
    apply(props.onChange, !checked)
  }

  return (
    <div className={`checkbox ${checked ? 'checked' : ''}`} onClick={onClick}>
      <div className="dot"></div>
      {!!children && <div className="label">{children}</div>}
    </div>
  )

}


export default Checkbox
