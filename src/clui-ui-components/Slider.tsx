import ComponentStore from '@store/componentStore'
import styles from '@styles/slider.module.css'
import classNames from 'classnames'
import React, { useState } from 'react'

const { CluiStore } = ComponentStore

const { updateConfiguration } = CluiStore

/**
 * Similar to {@link ListProps}
 */
type SliderProps = {
  parents: Array<string>
  title: string
  min: number
  max: number
  startValue: number
  child?: {
    component: any // Expect a JSX Element
    props: any
  }
}

/**
 * Abstraction of a Slider Functional Component which can be used in the CLUI
 * @param param0 {@link SliderProps}
 */

const Slider = ({
  parents,
  title,
  min,
  max,
  child,
  startValue = 0
}: SliderProps) => {
  const [sliderValue, setSliderValue] = useState(startValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    setSliderValue(newValue)
    updateConfiguration({ value: newValue }, [...parents])
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={classNames(
          styles['configure-slider'],
          'w-full flex justify-center py-6'
        )}>
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          onChange={handleChange}
          className={classNames(styles.slider, 'w-3/4')}
        />
      </div>
      <div>
        <p className="text-m text-gray-300">
          {title} : {sliderValue}%
        </p>
      </div>
      {child && <child.component {...child.props} />}
    </div>
  )
}

export default Slider
