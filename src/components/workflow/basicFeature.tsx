import features from '@features/features'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/basicFeatures.module.css'
import React, { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'

import { FeatureKeyType } from '~@types/otherTypes'

import DisplayFeature from './displayFeature'

type BasicFeatureProp = {
  // eslint-disable-next-line no-undef
  SubmitButton: ({ featureKey }: { featureKey?: string }) => JSX.Element
  usedFeatures: string[]
}

/**
 * Basic Feature UI/UX to toggle away from CLUI for users uncomfortable
 */
const BasicFeatures = ({ SubmitButton, usedFeatures }: BasicFeatureProp) => {
  const [selectedKey, setFeatureKey] = useState('TRANSCODE')
  const [selected, setSelected] = useState(0)

  const [validFeatures, setValidFeature] = useState<FeatureKeyType[]>(
    Object.keys(features) as FeatureKeyType[]
  )

  const checkFeature = (featureKey: string) => {
    if (usedFeatures.length > 0) {
      const index = usedFeatures.indexOf(featureKey)
      if (index === -1) return true
      return false
    }
    return true
  }

  useEffect(() => {
    const validKeys = Object.keys(features).filter(
      featureKey =>
        !features[featureKey as FeatureKeyType].noDisplay &&
        checkFeature(featureKey)
    )

    setValidFeature(validKeys as FeatureKeyType[])
    setFeatureKey(validKeys[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usedFeatures])

  const keyMap = {
    UP: ['up', 'k', 'w'],
    DOWN: ['down', 'j', 's']
  }

  const handlers = {
    DOWN: (e?: KeyboardEvent) => {
      e?.preventDefault()

      const newKey = selected + 1 < validFeatures.length ? selected + 1 : 0

      const newFeatureKey = validFeatures[newKey]
      setSelected(newKey)
      setFeatureKey(newFeatureKey)
    },
    UP: (e?: KeyboardEvent) => {
      e?.preventDefault()

      const newKey = selected - 1 >= 0 ? selected - 1 : validFeatures.length - 1
      const newFeatureKey = validFeatures[newKey]
      setSelected(newKey)
      setFeatureKey(newFeatureKey)
    }
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true}>
      <div className="flex flex-col h-full">
        <div className="flex h-full bg-gray-900">
          <div className="w-1/4 bg-gray-800 bg-opacity-25 h-full">
            <div className="flex">
              {validFeatures.length > 0 ? (
                <nav id="nav" className={styles.nav}>
                  <span
                    className="absolute w-full rounded-lg shadow ease-out highlighter transition-transform duration-200"
                    style={{
                      backgroundColor: '#6c63ff',
                      height: `${63 / validFeatures.length}vh`
                    }}
                  />
                  <ul className={styles.options}>
                    {validFeatures.map((featureKey, index) => {
                      const currentFeature = features[featureKey]

                      return (
                        <li
                          key={currentFeature.name}
                          className="h-full flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(index)
                              setFeatureKey(featureKey)
                            }}
                            // ariaSelected={selected === 0}
                            className="py-2 px-3 w-full h-full flex items-center focus:outline-none focus-visible:underline">
                            <FontAwesomeIcon
                              icon={faCog}
                              className={
                                selected === index
                                  ? 'text-gray-200'
                                  : 'text-gray-500'
                              }
                            />
                            <span
                              className={`ml-4 text-sm font-medium transition-all ease-out duration-200 ${
                                selected === index
                                  ? 'text-gray-50'
                                  : 'text-gray-300'
                              }`}>
                              {currentFeature.name}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              ) : null}
            </div>
          </div>
          <div className="w-full overflow-y-auto scroll-thin">
            {validFeatures.length > 0 ? (
              <DisplayFeature
                selectedKey={selectedKey as FeatureKeyType}
                SubmitButton={SubmitButton}></DisplayFeature>
            ) : (
              <div className="w-full flex flex-col items-center">
                <p className="text-3xl w-3/4 pt-20 text-center text-white">
                  All features have been used!
                </p>
                <p className="text-l w-3/4 py-4 pb-20 text-center text-white">
                  One feature can be currently only used once.
                </p>

                <div className="flex justify-center">
                  <SubmitButton></SubmitButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
            .highlighter {
              z-index: 0;
              transform: translateY(calc(100% * ${selected}));
            }
          `}
        </style>
      </div>
    </GlobalHotKeys>
  )
}

export default BasicFeatures
