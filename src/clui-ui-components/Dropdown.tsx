import React, { useEffect, useState, useRef } from 'react'

import Select from 'react-select'
import ComponentStore from '../store/componentStore'

import './list.css'

const { CluiStore } = ComponentStore

const { updateConfiguration } = CluiStore

/**
 * Element of a List displayed as buttons
 * Name and Value are self explanatory
 * The Child is another JSX.Element potentially another list,
 * which is displayed on choosing the parent element
 */

type DropElement = {
  name: string
  value: any
  child?: {
    component: any
    props: any
    paddingTop?: number
  }
  [name: string]: any
}
/**
 * Dropdown Element is expected to receive the following properties
 * parents is a string of keys representing the hierarchy of the calling elements
 * Example, if Transcode Feature is calling this List for choosing the codec
 * we would get a parent array of ["TRANSCODE","FORMAT", "CODECS"]
 * Current is the default element of the list, which is selected by default
 */
type DropDownProps = {
  parents: Array<string>
  dropdown: Array<DropElement>
  title: string
  current: DropElement
}

const generateElementRef = (dropdown: Array<DropElement>) => {
  const object: { [name: string]: DropElement } = {}
  for (const item of dropdown) {
    object[item.value] = item
  }
  return object
}

// const generateOptions = (dropdown: Array<DropElement>) => {
//   const object : {value:string, label:string}
// }

/**
 * Abstraction of a DropDown Functional Component that can be used in the CLUI
 * @param props {@link DropDownProps}
 */
const Dropdown = (props: DropDownProps) => {
  const { dropdown, title, parents } = props

  // eslint-disable-next-line react/destructuring-assignment
  const [current, setCurrent] = useState<DropElement>(props.current)

  const element = useRef(generateElementRef(dropdown))

  useEffect(() => {
    const defaultConfiguration = { value: current.value, name: current.name }
    updateConfiguration(defaultConfiguration, [...parents])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCurrent(props.current)
  }, [props])

  useEffect(() => {
    element.current = generateElementRef(dropdown)
    console.info('Update elements')
  }, [dropdown])

  const handleClick = (selectedOption: { value: any; [name: string]: any }) => {
    // e.preventDefault();
    const { value } = selectedOption
    if (element && element.current) {
      // console.info('Tree', element.current, value);
      const dataValue = element.current[value as keyof typeof element.current]
      setCurrent(dataValue)
      // console.info('Data value is', dataValue, current);
      const newConfiguration = { value: dataValue.value, name: dataValue.name }
      updateConfiguration(newConfiguration, [...parents])
    }
  }

  return (
    <>
      <div className="options-list-wrapper">
        <div className="flex justify-center items-center">
          <p className="text-xl">{title}</p>
          <div
            className="inline-block relative w-64"
            style={{ margin: '1rem' }}>
            <Select
              //  @ts-ignore
              onChange={handleClick}
              defaultValue={{ value: current.value, label: current.name }}
              value={{ value: current.value, label: current.name }}
              options={dropdown.map(item => ({
                value: item.value,
                label: item.name
              }))}
              styles={{
                control: styles => ({
                  ...styles,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  outline: 'none',
                  appearance: 'none',
                  zIndex: 5
                }),
                option: styles => ({
                  ...styles,
                  color: 'inherit'
                }),
                placeholder: styles => ({
                  ...styles,
                  color: 'inherit'
                }),
                singleValue: styles => ({
                  ...styles,
                  color: 'inherit'
                }),
                menu: styles => ({
                  ...styles,
                  zIndex: 10
                })
              }}
            />
          </div>
        </div>
      </div>
      {current.child && (
        <div className="child">
          <current.child.component {...current.child.props} />
        </div>
      )}
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .child {
            padding-top: ${current.child && current.child.paddingTop
              ? current.child.paddingTop
              : 0}%;
          }
        `}
      </style>
    </>
  )
}

export default Dropdown
