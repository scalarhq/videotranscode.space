import cx from 'classnames'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import Modal from 'react-modal'

import styles from '../../../styles/workflow.module.css'
import features, { Features } from '../../features/features'
import CluiStore from '../../store/cluiStore'
import { FeatureKeyType } from '../../types/otherTypes'
import BasicFeatures from './basicFeature'
import DisplayFeature from './displayFeature'

const { updateChosenFeatures } = CluiStore

const Workflow = () => {
  const [workflow, setWorkflow] = useState<string[]>([])

  const [modelState, setModalState] = useState(false)

  const [editFeature, setEditFeature] = useState<keyof Features | null>(null)

  // const [config, setConfig] = useState({})

  const config = toJS(CluiStore.configuration)

  // if (Object.keys(jsConfig).length > 0 && jsConfig !== config) {
  //   setConfig(jsConfig)
  // }

  useEffect(() => {
    updateChosenFeatures(
      workflow.map(w => {
        return { name: w as FeatureKeyType }
      })
    )
  }, [workflow])

  const updateModalState = (state: boolean) => {
    setEditFeature(null)
    setModalState(state)
  }

  const updateEditFeature = (featureKey: keyof Features) => {
    setEditFeature(featureKey)
    setModalState(true)
  }

  const SubmitButton = ({
    featureKey,
    buttonText
  }: {
    featureKey?: string
    buttonText?: string
  }) => {
    const [currentFeature, setFeatureKey] = useState('')

    useEffect(() => {
      if (featureKey) {
        setFeatureKey(featureKey)
      }
    }, [featureKey])

    const handleSubmit = () => {
      if (featureKey) {
        setWorkflow(prev => [...prev, currentFeature])
      }
      updateModalState(false)
    }

    return (
      <button
        className={`text-white font-bold py-2 px-4 mb-12 rounded bg-blue-500`}
        type="submit"
        onClick={handleSubmit}>
        {buttonText || 'Submit'}
      </button>
    )
  }

  const keyMap = {
    COMMAND_PALLETE: ['alt+p']
  }

  const handlers = {
    COMMAND_PALLETE: (e?: KeyboardEvent) => {
      e?.preventDefault()
      updateModalState(!modelState)
    }
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      <div
        className={cx(
          styles.wrapper,
          `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex ${
            workflow.length > 0 ? '' : 'cursor-pointer'
          }`
        )}
        onClick={() => {
          if (workflow.length === 0) updateModalState(true)
        }}>
        {workflow.length === 0 ? (
          <div className="max-w-3xl mx-auto flex flex-col justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-36 h-36 text-indigo-500"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p>
              <u>Choose</u> your configuration here
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <p className="text-2xl text-white pb-4">Order of operations</p>
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-indigo-500 bg-opacity-70"
                      aria-hidden="true"
                    />

                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full  flex items-center justify-center ">
                          {/* Heroicon name: user */}
                          <svg
                            className="h-8 w-8 text-default"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-m text-gray-200">
                            Using inputted files
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                {workflow.map((featureKey, index) => {
                  const name =
                    features[featureKey as keyof typeof features].name

                  return (
                    <li key={`feature-${index}`}>
                      <div className="relative pb-8">
                        {index !== workflow.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-indigo-500 bg-opacity-70"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full  flex items-center justify-center ">
                              {/* Heroicon name: thumb-up */}
                              <svg
                                className="h-8 w-8 text-default"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-m text-gray-200">
                                {index + 1}.{' '}
                                <span className="text-gray-50 font-bold">
                                  {name}
                                </span>{' '}
                                feature will be processed.
                              </p>
                            </div>
                            <div className="text-right text-m whitespace-nowrap text-gray-400">
                              <p
                                onClick={() => {
                                  updateEditFeature(
                                    featureKey as keyof Features
                                  )
                                }}
                                className="cursor-pointer underline">
                                Edit
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div
              className="h-full w-full cursor-pointer"
              onClick={() => {
                updateModalState(true)
              }}>
              <div className="max-w-3xl mx-auto flex flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-16 h-16 text-indigo-500"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p>
                  <u>Add</u> more steps!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        ariaHideApp={false}
        isOpen={modelState}
        onRequestClose={() => {
          updateModalState(false)
        }}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: 'rgba(107, 114, 128, 0.5)'
          },
          content: {
            backgroundColor: 'transparent',
            border: 'none'
          }
        }}>
        <div className="flex w-full h-full justify-center">
          {' '}
          <div
            className="inline-block align-bottom bg-background bg-opacity-60 rounded-lg pr-4 pt-5  text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6 sm:pl-0 sm:py-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline">
            <div className="w-full h-full">
              {editFeature === null ? (
                <BasicFeatures
                  SubmitButton={SubmitButton}
                  usedFeatures={workflow}></BasicFeatures>
              ) : Object.keys(config).length > 0 ? (
                <div className="flex flex-col h-full">
                  <div className="flex h-full">
                    <DisplayFeature
                      selectedKey={editFeature}
                      SubmitButton={() => {
                        return (
                          <SubmitButton buttonText="Confirm Edit"></SubmitButton>
                        )
                      }}></DisplayFeature>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </GlobalHotKeys>
  )
}

export default observer(Workflow)
