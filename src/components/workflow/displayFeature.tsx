import features from '@features/features'
import React from 'react'

import { FeatureKeyType } from '~@types/otherTypes'

type DisplayFeatureProps = {
  // eslint-disable-next-line no-undef
  SubmitButton: ({ featureKey }: { featureKey?: string }) => JSX.Element
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
              return currentFeature.ui
            } else {
              return (
                <div className="flex flex-col">
                  <p className="text-2xl text-center py-20">
                    The feature {currentFeature.name} has no configuration.
                  </p>
                </div>
              )
            }
          })()}
        </div>

        <div className="flex justify-center">
          <SubmitButton featureKey={selectedKey}></SubmitButton>
        </div>
      </div>
    </>
  )
}

export default DisplayFeature
