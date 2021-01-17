import features from '@features/features'
import React from 'react'

import { FeatureKeyType } from '~@types/otherTypes'

type DisplayFeatureProps = {
  SubmitButton: ({
    featureKey,
    buttonText
  }: {
    featureKey?: string
    buttonText?: string

    // eslint-disable-next-line no-undef
  }) => JSX.Element
  selectedKey: FeatureKeyType
}

const DisplayFeature = ({ selectedKey, SubmitButton }: DisplayFeatureProps) => {
  return (
    <>
      <div className="w-full flex flex-col pl-4 pr-2 justify-center">
        <div className="py-4">
          {(() => {
            const currentFeature = features[selectedKey]

            if (currentFeature.ui) {
              return (
                <div className="flex flex-col divide-y-4 divide-indigo-400 divide-opacity-30">
                  <div>
                    {currentFeature.descriptionUI
                      ? currentFeature.descriptionUI
                      : null}
                  </div>
                  <div>{currentFeature.ui}</div>
                </div>
              )
            } else {
              return (
                <div className="flex flex-col divide-y-4 divide-indigo-400 divide-opacity-30">
                  <div>
                    {currentFeature.descriptionUI
                      ? currentFeature.descriptionUI
                      : null}
                  </div>

                  <p className="text-2xl text-center py-10 text-gray-200">
                    This feature has no configuration.
                  </p>
                </div>
              )
            }
          })()}
        </div>

        <div className="flex justify-center">
          <SubmitButton
            buttonText="Add"
            featureKey={selectedKey}></SubmitButton>
        </div>
      </div>
    </>
  )
}

export default DisplayFeature
