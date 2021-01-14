import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'

import styles from '../../../styles/basicFeatures.module.css'
import features from '../../features/features'
import ComponentStore from '../../store/componentStore'
import { FeatureKeyType } from '../../types/otherTypes'
import DisplayFeature from './displayFeature'

const { CluiStore } = ComponentStore

const { updateChosenFeatures } = CluiStore

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

  useEffect(() => {
    updateChosenFeatures([{ name: selectedKey as FeatureKeyType }])
  }, [selectedKey])

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
  }, [usedFeatures])

  const keyMap = {
    UP: ['up', 'j', 'w'],
    DOWN: ['down', 'k', 's']
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
        <div className="flex h-full">
          <div className="w-1/4 bg-gray-800 bg-opacity-25 h-full">
            <div className="flex">
              {validFeatures.length > 0 ? (
                <nav id="nav" className={styles.nav}>
                  <span
                    className="absolute w-full rounded-lg shadow ease-out highlighter transition-transform transition-medium"
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
                              color={selected === index ? 'white' : 'inherit'}
                            />
                            <span
                              className="ml-4 text-m font-medium transition-all ease-out transition-medium "
                              style={{
                                color: selected === index ? 'white' : 'inherit'
                              }}>
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
