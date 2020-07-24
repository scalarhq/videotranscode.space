import React from 'react';
import features, { FeatureElement } from '../../features/features';
import Submit from '../../clui-ui-components/Submit';

import './clui-ui.css';

/**
 * Creates a UI of Features for each workflow, with the proper wrappers and a Submit button
 *  Maps every step in a workflow to a feature then to a UI Element and displays that
 * @param param0 Expects steps of the workflow as keys of features
 */
const WorkflowUi = ({ steps }: { steps: Array<string> }) => {
  const featuresInUse: Array<FeatureElement> = [];
  for (const featureKey of steps) {
    featuresInUse.push(features[featureKey as keyof typeof features]);
  }
  const UiElements = featuresInUse.map((feature) => feature.ui);
  return (
    <div className="workflow-wrapper">

      {UiElements.map((Element) => {
        if (typeof Element === 'string') {
          return (<div className="row"><p>{Element}</p></div>);
        }
        return (<div className="row">{Element}</div>);
      })}
      <div className="row"><Submit /></div>
    </div>
  );
};

export default WorkflowUi;
