import React from 'react';
import features, { FeatureElement } from '../../features/features';
import Submit from '../../clui-ui-components/Submit';

import './clui-ui.css';

const WorkflowUi = ({ steps }: { steps: Array<string> }) => {
  const featuresInUse: Array<FeatureElement> = [];
  for (const featureKey of steps) {
    featuresInUse.push(features[featureKey]);
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
