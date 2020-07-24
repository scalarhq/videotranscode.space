import React from 'react';
import Submit from '../../clui-ui-components/Submit';

import './clui-ui.css';

/**
 * Creates the Feature UI Element with Submit button and proper wrappers
 * @param param0 Expects a Feature UI Element
 */
const FeatureUi = ({ ui }: { ui: JSX.Element | string }) => (
  <div className="feature-wrapper">
    <div className="row">
      {typeof ui === 'string' ? <p>{ui}</p> : ui}
    </div>
    <div className="row">
      <Submit />
    </div>
  </div>
);

export default FeatureUi;
