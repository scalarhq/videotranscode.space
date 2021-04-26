import ComponentStore from '@store/componentStore'
import styles from '@styles/list.module.css'
import cx from 'classnames'
import React, { useEffect, useState } from 'react'

const { CluiStore } = ComponentStore

const { updateConfiguration } = CluiStore

/**
 * Element of a List displayed as buttons
 * Name and Value are self explanatory
 * The Child is another JSX.Element potentially another list,
 * which is displayed on choosing the parent element
 */

type ListElement = {
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
 * List Element is expected to receive the following properties
 * parents is a string of keys representing the hierarchy of the calling elements
 * Example, if Transcode Feature is calling this List for choosing the codec
 * we would get a parent array of ["TRANSCODE","FORMAT", "CODECS"]
 * Current is the default element of the list, which is selected by default
 */
type ListProps = {
  parents: Array<string>
  list: Array<ListElement>
  title: string
  current: ListElement
}

/**
 * Abstraction of a List Functional Component that can be used in the CLUI
 * @param props {@link ListProps}
 */

const List = (props: ListProps) => {
  const { list, parents } = props

  // eslint-disable-next-line react/destructuring-assignment
  const [current, setCurrent] = useState<ListElement>(props.current)

  useEffect(() => {
    const defaultConfiguration = { name: current.name, value: current.value }
    updateConfiguration(defaultConfiguration, [...parents])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (e: React.MouseEvent, element: ListElement) => {
    e.preventDefault()
    setCurrent(element)
    const newConfiguration = { name: element.name, value: element.value }
    updateConfiguration(newConfiguration, [...parents])
  }

  return (
    <div className={styles.optionsListWrapper}>
      {/* Removed cause it's obvious that this section is the feature's settings
      <h1 className="py-2 text-lg leading-6 font-medium text-gray-50">
        {title}
      </h1> */}
      <div className={cx(styles.optionsList, 'w-full', 'mt-8')}>
        {list.map(item => (
          <div className={styles.optionsListItemWrapper} key={item.name}>
            <div
              className={cx(
                styles.optionsListItem,
                'flex justify-center',
                item.name === current.name
                  ? styles.optionsListItemActive
                  : 'text-gray-200'
              )}>
              <button
                className="outline-none text-center"
                type="button"
                onClick={e => handleClick(e, item)}>
                {item.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      {current.child && (
        <div className="child w-full">
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
    </div>
  )
}

export default List
