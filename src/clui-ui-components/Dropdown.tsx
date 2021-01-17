import ComponentStore from '@store/componentStore'
import styles from '@styles/list.module.css'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'

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
  usingExisting: boolean
}

const generateElementRef = (dropdown: Array<DropElement>) => {
  const object: { [name: string]: DropElement } = {}
  for (const item of dropdown) {
    object[item.value] = item
  }
  return object
}

/**
 * Abstraction of a DropDown Functional Component that can be used in the CLUI
 * @param props {@link DropDownProps}
 */
const Dropdown = (props: DropDownProps) => {
  const { dropdown, title, parents, usingExisting } = props

  // eslint-disable-next-line react/destructuring-assignment
  const [current, setCurrent] = useState<DropElement>(props.current)

  const element = useRef(generateElementRef(dropdown))

  useEffect(() => {
    if (!usingExisting) {
      const defaultConfiguration = { value: current.value, name: current.name }

      updateConfiguration(defaultConfiguration, [...parents])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCurrent(props.current)
  }, [props])

  useEffect(() => {
    element.current = generateElementRef(dropdown)
  }, [dropdown])

  const handleClick = (selectedOption: { value: any; [name: string]: any }) => {
    const { value } = selectedOption

    if (element && element.current) {
      const dataValue = element.current[value as keyof typeof element.current]

      setCurrent(dataValue)

      const newConfiguration = { value: dataValue.value, name: dataValue.name }

      updateConfiguration(newConfiguration, [...parents])
    }
  }

  return (
    <>
      <div className={styles.optionsListWrapper}>
        <div className="flex justify-center items-center">
          <p className="text-xl text-gray-50">{title}</p>
          <div
            className="inline-block relative w-64 bg-background bg-opacity-30 "
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
              theme={theme => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: 'rgba(108, 99, 255, 0.5)',
                  primary: 'rgba(108, 99, 255, 1)',
                  neutral0: 'rgba(31, 41, 55, 0.8)'
                }
              })}
              styles={{
                control: styles => ({
                  ...styles,
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  outline: 'none',
                  appearance: 'none',
                  zIndex: 5
                }),
                option: styles => ({
                  ...styles,
                  color: 'white'
                }),
                placeholder: styles => ({
                  ...styles,
                  color: 'black'
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
