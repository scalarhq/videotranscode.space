import Submit from '@cluiComponents/Submit'
import features, { Features } from '@features/features'
import ComponentStore from '@store/componentStore'
import keyboardStore from '@store/keyboardStore'
import styles from '@styles/workflow.module.css'
import cx from 'classnames'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GlobalHotKeys } from 'react-hotkeys'
import Modal from 'react-modal'

import { FeatureKeyType } from '~@types/otherTypes'

import BasicFeatures from './basicFeature'
import DisplayFeature from './displayFeature'

const Workflow = () => {
  const { CluiStore, FileStore, loaded } = ComponentStore

  const { allFiles } = FileStore

  const [workflow, setWorkflow] = useState<string[]>([])

  const [currentFeature, setFeatureKey] = useState('')

  const [modelState, setModalState] = useState(false)

  const [editFeature, setEditFeature] = useState<keyof Features | null>(null)

  const config = toJS(CluiStore.configuration)

  const { updateChosenFeatures, setSubmitStatus } = CluiStore

  useEffect(() => {
    keyboardStore.toggleModal = () => {
      setModalState(c => !c)
    }
    return () => {
      keyboardStore.toggleModal = null
    }
  }, [])

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

  const keyMap = {
    COMMAND_PALLETE: ['alt+p', 'shift+p'],
    SUBMIT: ['ctrl+enter', 'shift+enter']
  }

  const updateWorkflow = (newFeature: string) => {
    toast.success('Added new feature')
    setWorkflow(prev => [...prev, newFeature])
  }

  const SubmitButton = ({
    featureKey,
    buttonText
  }: {
    featureKey?: string
    buttonText?: string
  }) => {
    useEffect(() => {
      if (featureKey) {
        setFeatureKey(featureKey)
      }
    }, [featureKey])

    const handleSubmit = () => {
      if (featureKey) {
        updateWorkflow(currentFeature || featureKey)
      }
      updateModalState(false)
    }

    return (
      <button
        className={`text-white font-bold py-2 px-4 mb-12 rounded bg-indigo-500`}
        type="submit"
        onClick={handleSubmit}>
        {buttonText || 'Submit'}
      </button>
    )
  }

  const handlers = {
    COMMAND_PALLETE: (e?: KeyboardEvent) => {
      e?.preventDefault()
      setModalState(c => !c)
    },
    SUBMIT: (e?: KeyboardEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      if (modelState) {
        updateWorkflow(currentFeature)
        updateModalState(false)
      } else {
        if (workflow.length > 0) {
          if (!loaded) {
            toast.error(
              'Please wait for FFmpeg to load, this can take upto 30 seconds'
            )
          } else if (loaded && allFiles.length === 0) {
            toast.error('Please add a file!')
          } else {
            toast.success('Started processing!', {
              duration: 6000
            })
            setSubmitStatus(true)
          }
        }
      }
    }
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true}>
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
            <div className="">
              <svg
                className="w-40 h-40 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="pt-3">
                Choose <u>your configuration</u> here
              </p>
            </div>
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
            <div className="w-full py-20">
              <Submit
                customStyling="inline-flex uppercase items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                customText="Start ↵"></Submit>
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
        <div
          className="flex w-full h-full justify-center cursor-pointer "
          onClick={() => {
            setModalState(false)
          }}>
          <div
            className="inline-block settings-tour-highlight cursor-default align-bottom bg-background bg-opacity-60 rounded-lg pr-4 pt-5  text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6 sm:pl-0 sm:py-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            onClick={e => {
              e.stopPropagation()
            }}>
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                onClick={() => {
                  setModalState(false)
                }}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
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
