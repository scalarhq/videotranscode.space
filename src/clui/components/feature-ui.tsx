import React from 'react';
import Submit from '../../clui-ui-components/Submit';

import './clui-ui.css';

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
