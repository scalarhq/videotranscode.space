import './basicFeature.css'

import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

import Submit from '../../clui-ui-components/Submit'
import features from '../../features/features'
import ComponentStore from '../../store/componentStore'

const { CluiStore } = ComponentStore

const { updateChosenFeatures } = CluiStore

type KeyType = keyof typeof features

/**
 * Basic Feature UI/UX to toggle away from CLUI for users uncomfortable
 */
const BasicFeatures = () => {
  const [selectedKey, setFeatureKey] = useState('TRANSCODE')
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    updateChosenFeatures([{ name: selectedKey as keyof typeof features }])
  }, [selectedKey])

  const noOfFeatures = (() =>
    Object.keys(features).filter(
      featureKey =>
        !features[featureKey as KeyType].noDisplay &&
        features[featureKey as KeyType].ui
    ).length)()

  return (
    <div className="basic-feature-wrapper">
      <div className="flex">
        <div className="w-1/4 bg-gray-800 bg-opacity-25 h-full">
          <div className="flex justify-center">
            <nav id="nav" className="w-56 relative nav">
              <span
                className="absolute w-full rounded-lg shadow ease-out highlighter transition-transform transition-medium"
                style={{
                  backgroundColor: '#6c63ff',
                  height: `${63 / noOfFeatures}vh`
                }}
              />
              <ul className="relative options divide-y divide-gray-700">
                {Object.keys(features).map((featureKey, index) => {
                  const currentFeature = features[featureKey as KeyType]
                  if (!currentFeature.noDisplay && currentFeature.ui) {
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
                            className="ml-2 text-sm font-medium transition-all ease-out transition-medium "
                            style={{
                              color: selected === index ? 'white' : 'inherit'
                            }}>
                            {currentFeature.name}
                          </span>
                        </button>
                      </li>
                    )
                  }
                  return null
                })}
              </ul>
            </nav>
          </div>
        </div>
        <div
          className="w-3/4 flex flex-col pl-4 pr-2 justify-center"
          style={{ height: '60vh' }}>
          <div className="single-flex-wrapper">
            {(() => {
              const currentFeature = features[selectedKey as KeyType]
              return currentFeature.ui
            })()}
          </div>
          <div className="row">
            <Submit />
          </div>
        </div>
      </div>

      {/* <div className="toggle">
        <div className="toggle-label">
          <p>Convert (Transcode)</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={transcodeToggle}
            onChange={(e) => {
              setToggled(!transcodeToggle);
            }}
          />
          <span className="toggle-slider round" />
        </label>
        <div className="toggle-label">
          <p>Compress (Reduce File Size)</p>
        </div>
      </div>
      <div className="single-feature-wrapper">{transcodeToggle ? COMPRESS.ui : TRANSCODE.ui}</div>
      <div className="row">
        <Submit />
      </div> */}
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .highlighter {
            z-index: 0;
            transform: translateY(calc(100% * ${selected}));
          }
          .nav {
            display: grid;
            grid-template: 1fr / 1fr;
            height: 63vh;
            overflow-y: auto;
          }

          .nav > * {
            grid-column: 1 / 1;
            grid-row: 1 / 1;
          }

          .options {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }

          .single-feature-wrapper {
            padding-top: 3vh;
          }
          .row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
          }
          .options-list-wrapper {
            padding-top: 0rem !important;
            padding-bottom: 0rem !important;
          }
          .basic-feature-wrapper {
            display: flex;
            flex-direction: column;
            width: 40vw;
            height: 100%;
          }

          .toggle {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
          .toggle-label {
            padding: 0 2%;
            font-weight: 400;
          }

          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          .toggle-slider:before {
            position: absolute;
            content: '';
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          input:checked + .toggle-slider {
            background-color: #6c63ff;
          }

          input:focus + .toggle-slider {
            box-shadow: 0 0 1px #2196f3;
          }

          input:checked + .toggle-slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
          }

          /* Rounded sliders */
          .toggle-slider.round {
            border-radius: 34px;
          }

          .toggle-slider.round:before {
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  )
}

export default BasicFeatures
