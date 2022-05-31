import React, { useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "../checkbox";
import './index.css'



const PropsType = {
  title: '',
  checked: false,
  items: {},
  onCheckedChange: () => null,
  onItemCheckedChange: () => null,
  onSubitemCheckedChange: () => null
}

const ListItem = props => {
  const {checked, title = '', items } = props

  const item1 = useMemo(() => {
    // console.log('items change gen item1')
    return items.item1
  }, [items])

  const item2 = useMemo(() => {
    // console.log('items change gen item2')
    return items.item2
  }, [items])

  const apply = (cb, ...args) => {
    return typeof cb === 'function' ? cb(...args) : undefined
  }
  
  const toArray = list => {
    return Array.isArray(list) ? list : []
  }
  
  const nextTick = cb => {
    return typeof cb === 'function' ? cb() : undefined
    // const p = Promise.resolve()
    // return typeof cb === 'function' ? p.then(cb) : p
  }
  
  const simpleDeepClone = value => {
    return JSON.parse(JSON.stringify(value))
  }

  const genItem = (item, checked) => {
    return { ...item, checked }
  }

  // const itemsRef = useRef(items)
  const checkedRef = useRef(checked)

  // useEffect(() => {
  //   itemsRef.current = items
  // }, [items])

  // useEffect(() => {
  //   checkedRef.current = checked
  //   const {item1, item2} = itemsRef.current
  //   if (checked && !item1.checked && !item2.checked) {
  //     return apply(props.onItemCheckedChange, 'item2', checked)
  //   } else if (!checked) {
  //     item1.checked && apply(props.onItemCheckedChange, 'item1', false)
  //     item2.checked && apply(props.onItemCheckedChange, 'item2', false)
  //   }
  // }, [checked, props.onItemCheckedChange])

  const emitOnCheckedChange = checked => {
    apply(props.onCheckedChange, checked)
    nextTick(() => {
      if (checked) {
        return apply(props.onItemCheckedChange, 'item2', true)
      }
      Object.keys(items).forEach(key => {
        apply(props.onItemCheckedChange, key, false)
      })
    })
  }

  const emitItemCheckedChange = (key, checked) => {
    apply(props.onItemCheckedChange, key, checked)
    const subitems = simpleDeepClone(toArray(items[key].subitems))
    nextTick(() => {
      // 勾选默认子项
      if (checked) {
        const defaultItemIndex = 0
        const nextSubitems = subitems.map((item, index) => genItem(item, index === defaultItemIndex))
        return apply(props.onSubitemCheckedChange, key, nextSubitems)
      }
      // 清空
      const nextSubitems = subitems.map(item => genItem(item, false)) 
      apply(props.onSubitemCheckedChange, key, nextSubitems)
    })
  }

  const emitSubitemsCheckedChange = (key, checked, index) => {
    console.group(`ListItem onSubitemCheckedChange[${index}]`)
    console.log(`key: `, key)
    console.log(`index: `, index)
    console.log(`checked: `, checked)
    const subitems = JSON.parse(JSON.stringify(toArray(items[key].subitems)))
    console.log(`subitems: `, subitems)
    subitems[index].checked = checked
    const nextMainCheckedState = subitems.filter(item => !!item.checked).length > 0
    const shouldChecked = nextMainCheckedState !== items[key].checked
    console.log(`nextMainCheckedState: `, nextMainCheckedState)
    console.log(`shouldChecked: `, shouldChecked)
    apply(props.onSubitemCheckedChange, key, subitems)
    console.groupEnd()
    shouldChecked && nextTick(() => {
      console.log('apply shouldChecked')
      apply(props.onItemCheckedChange, key, nextMainCheckedState)
    })
  }

  // useEffect(() => {
  //   if (checked && )
  // }, [checked, ])

  useEffect(() => {
    const subitems = toArray(item1.subitems)
    const checkedItems = subitems.filter(item => !!item.checked)
    if (item1.checked && !checkedItems.length) {
      const nextSubitems = subitems.map((item, index) => genItem(item, index === 0))
      return apply(props.onSubitemCheckedChange, 'item1', nextSubitems)
    }
    if (!item1.checked && checkedItems.length) {
      const nextSubitems = subitems.map(item => genItem(item, false))
      apply(props.onSubitemCheckedChange, 'item1', nextSubitems)
    }
  }, [item1.checked, item1.subitems, props.onSubitemCheckedChange])

  useEffect(() => {
    const subitems = toArray(item2.subitems)
    const checkedItems = subitems.filter(item => !!item.checked)
    if (item2.checked && !checkedItems.length) {
      const nextSubitems = subitems.map((item, index) => genItem(item, index === 0))
      return apply(props.onSubitemCheckedChange, 'item2', nextSubitems)
    }
    if (!item2.checked && checkedItems.length) {
      const nextSubitems = subitems.map(item => genItem(item, false))
      apply(props.onSubitemCheckedChange, 'item2', nextSubitems)
    }
  }, [item2.checked, item2.subitems, props.onSubitemCheckedChange])

  useEffect(() => {
    const checked = [item1.checked, item2.checked].some(item => !!item)
    apply(props.onCheckedChange, checked)
  }, [item1.checked, item2.checked, props.onCheckedChange])


  return (
    <div>
      <div className="group">
        <div className="group-title">
          <Checkbox checked={checked} onChange={emitOnCheckedChange}>{title}</Checkbox>
        </div>
      </div>

      <div className="list-item">
        <div className="list-item-hd">
          <Checkbox checked={item1.checked} onChange={checked => emitItemCheckedChange('item1', checked)}>{item1.title}</Checkbox>
        </div>
        <div className="list-item-bd">
          {toArray(item1.subitems).map((item, index) => (
            <div className="item-checkbox" key={item.label}>
              <Checkbox
                checked={!!item.checked}
                onChange={checked => emitSubitemsCheckedChange('item1', checked, index)}>
                  {item.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <div className="list-item">
        <div className="list-item-hd">
          <Checkbox checked={item2.checked} onChange={checked => emitItemCheckedChange('item2', checked)}>{item2.title}</Checkbox>
        </div>
        <div className="list-item-bd">
          {toArray(item2.subitems).map((item, index) => (
            <div className="item-checkbox" key={item.label}>
              <Checkbox
                checked={!!item.checked}
                onChange={checked => emitSubitemsCheckedChange('item2', checked, index)}>
                  {item.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


export default ListItem

