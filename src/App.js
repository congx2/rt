import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Checkbox from './components/checkbox';
import List from './components/list-item'
import { useDeepCloneState } from './hooks.ts'

const getInitItems = () => {
  return {
    item1: {
      key: 'item1',
      title: 'Nikola',
      checked: false,
      subitems: [
        {
          label: 'A',
          checked: false
        },
        {
          label: 'B',
          checked: false
        },
        {
          label: 'C',
          checked: false
        }
      ]
    },
    item2: {
      key: 'item2',
      title: 'Tesla',
      checked: false,
      subitems: [
        {
          label: 'A',
          checked: false
        },
        {
          label: 'B',
          checked: false
        },
        {
          label: 'C',
          checked: false
        },
        {
          label: 'D',
          checked: false
        }
      ]
    }
  }
}
function App() {
  const simpleDeepClone = value => {
    return JSON.parse(JSON.stringify(value))
  }
  
  const [groupChecked, setGroupChecked] = useState(false)
  const [items, setItems] = useState(getInitItems())

  // const setItems = value => {
  //   console.group('setItems')
  //   console.log('items: ', simpleDeepClone(value))
  //   const result = setItems1(simpleDeepClone(value))
  //   console.log('set result: ', result)
  //   console.log('after set items: ', items)
  //   console.groupEnd()
  // }

  const onCheckedChange = checked => {
    if (checked === groupChecked) {
      return
    }
    setGroupChecked(checked)
    const nextItems = simpleDeepClone(items)
    if (!checked) {
      nextItems.item1.checked = false
      nextItems.item2.checked = false
      return setItems(nextItems)
    }
    if (checked && !nextItems.item1.checked && !nextItems.item2.checked) {
      nextItems.item2.checked = true
      return setItems(nextItems)
    }
  }

  const onItemCheckedChange = (key, checked) => {
    setItems(prevItems => {
      console.group(`App onItemCheckedChange[${key}]`)
      console.log('checked: ', checked)
      console.log('prevItems: ', prevItems)
      const nextItems = simpleDeepClone(prevItems)
      nextItems[key].checked = checked
      console.log('nextItems: ', nextItems)
      console.groupEnd()
      return nextItems
    })
  }

  const onSubitemCheckedChange = (key, subitems) => {
    setItems(prevItems => {
      console.group(`App onSubitemCheckedChange[${key}]`)
      console.log('subitems: ', simpleDeepClone(subitems))
      const nextItems = simpleDeepClone(prevItems)
      nextItems[key].subitems = simpleDeepClone(subitems)
      console.log('nextItems: ', nextItems)
      console.groupEnd()
      return nextItems
    })
  }

  return (
    <div className="App">
        <ul>
          <li onClick={() => onCheckedChange(!groupChecked)}>SetGroupChecked</li>
          <li onClick={() => onItemCheckedChange('item1', !items.item1.checked)}>SetItemCheckedChange item1</li>
          <li onClick={() => onItemCheckedChange('item2', !items.item2.checked)}>SetItemCheckedChange item2</li>
        </ul>
        <List
          title="NikolaTesla"
          checked={groupChecked}
          items={items}
          onCheckedChange={onCheckedChange}
          onItemCheckedChange={onItemCheckedChange}
          onSubitemCheckedChange={onSubitemCheckedChange}
        >
        </List>
    </div>
  );
}

export default App;
