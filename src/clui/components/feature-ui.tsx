/* global JSX */
import React, { useEffect } from 'react'

import Submit from '../../clui-ui-components/Submit'
import features from '../../features/features'
import ComponentStore from '../../store/componentStore'

const { CluiStore } = ComponentStore

const { updateChosenFeatures } = CluiStore

type FeatureUiProps = {
  ui: JSX.Element | string
  featureKey: keyof typeof features
}

/**
 * Creates the Feature UI Element with Submit button and proper wrappers
 * @param param0 Expects a Feature UI Element
 */
const FeatureUi = ({ ui, featureKey }: FeatureUiProps) => {
  useEffect(() => {
    // Sets the chosen features array as a single element feature
    updateChosenFeatures([{ name: featureKey }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="feature-wrapper">
      <div className=" py-5">{typeof ui === 'string' ? <p>{ui}</p> : ui}</div>
      <div className=" pt-5">
        <Submit />
      </div>
    </div>
  )
}

export default FeatureUi
