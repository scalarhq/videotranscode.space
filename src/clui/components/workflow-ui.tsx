import Submit from '@cluiComponents/Submit'
import features, { FeatureElement } from '@features/features'
import ComponentStore from '@store/componentStore'
import React, { useEffect } from 'react'

import { WorkflowStep } from '../../dist/workflow'

const { CluiStore } = ComponentStore

const { updateChosenFeatures } = CluiStore

const displaySubFeatures = (featureKey: WorkflowStep) => {
  const featuresInUse: Array<FeatureElement> = []
  if (featureKey.name === 'COMBINED_EXEC_FEATURE') {
    const { configuration } = featureKey

    for (const subFeature of configuration?.steps || []) {
      featuresInUse.push(features[subFeature.name])
      featuresInUse.push(...displaySubFeatures(subFeature))
    }
  }
  return featuresInUse
}

/**
 * Creates a UI of Features for each workflow, with the proper wrappers and a Submit button
 *  Maps every step in a workflow to a feature then to a UI Element and displays that
 * @param param0 Expects steps of the workflow as keys of features
 */
const WorkflowUi = ({ steps }: { steps: Array<WorkflowStep> }) => {
  useEffect(() => {
    updateChosenFeatures(steps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const featuresInUse: Array<FeatureElement> = []
  for (const featureKey of steps) {
    featuresInUse.push(features[featureKey.name])
    featuresInUse.push(...displaySubFeatures(featureKey))
  }
  const UiElements = featuresInUse.map(feature => feature.ui)
  return (
    <div className="workflow-wrapper">
      {UiElements.map((Element, index) => {
        if (typeof Element === 'string') {
          return (
            <div className="column pt-5">
              <p>{Element}</p>
            </div>
          )
        }
        return (
          <div key={`elementInWorkflow${index}`} className=" pt-5">
            {Element}
          </div>
        )
      })}
      <div className="column pt-5">
        <Submit />
      </div>
    </div>
  )
}

export default WorkflowUi
