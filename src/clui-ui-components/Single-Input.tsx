import ComponentStore from '@store/componentStore'
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
    <div className="single-input-wrapper">
      <div className="single-input">
        <input
          type={type}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          className={
            className ||
            'single-input-element appearance-none block w-full bg-gray-700 text-gray-200 bg-opacity-50 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:text-gray-50 focus:bg-opacity-75'
          }
          {...otherProps}
        />
      </div>

      {child && (
        <div className="child">
          <child.component {...child.props} />
        </div>
      )}
      {/* @ts-ignore */}
      <style jsx>
        {`
          .single-input-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .child {
            width: 100%;
          }
          .single-input-element {
            -moz-appearance: textfield;
          }

          .single-input {
            display: block;
            outline: 0;
            padding: 0 1rem;
            text-decoration: none;
            width: 50%;
            height: 2.75rem;
          }
        `}
      </style>
    </div>
  )
}

export default SingleInput
