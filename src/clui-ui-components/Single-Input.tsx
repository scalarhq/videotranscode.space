import ComponentStore from '@store/componentStore'
import styles from '@styles/singleInput.module.css'
import classNames from 'classnames'
import React, { useState } from 'react'
const { CluiStore } = ComponentStore

const { updateConfiguration } = CluiStore

/**
 * Similar to {@link ListProps}
 */
type SingleInputProps = {
  parents: Array<string>
  type: string
  defaultValue: any
  placeholder?: string
  otherProps?: any
  className?: string
  child?: {
    component: any // Expect a JSX Element
    props: any
  }
}

/**
 * Abstraction of a Slider Functional Component which can be used in the CLUI
 * @param param0 {@link SliderProps}
 */

const SingleInput = ({
  parents,
  type,
  placeholder,
  child,
  otherProps,
  className,
  defaultValue
}: SingleInputProps) => {
  const [inputValue, setInputValue] = useState<any>(defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    updateConfiguration({ value: e.target.value }, [...parents])
  }

  return (
    <div className={styles['single-input-wrapper']}>
      <div className={styles['single-input']}>
        <input
          type={type}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          className={
            className ||
            classNames(
              styles['single-input-element'],
              'appearance-none block w-full bg-gray-700 text-gray-200 bg-opacity-50 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:text-gray-50 focus:bg-opacity-75'
            )
          }
          {...otherProps}
        />
      </div>

      {child && (
        <div className={styles.child}>
          <child.component {...child.props} />
        </div>
      )}
    </div>
  )
}

export default SingleInput
