/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import { Fade } from 'react-reveal';

import Clui from '../../clui/clui';
import BasicFeatures from '../basic-features/basicFeature';
import './configuration.css';

const Configuration = () => {
  const [cluiToggle, setCluiToggle] = useState(true);

  return (

    <div className="configuration-wrapper">
      <div className="config">
        <Fade right collapse opposite when={cluiToggle} delay={200} duration={1000}>
          <Clui />
        </Fade>

        <Fade right collapse opposite when={!cluiToggle} delay={500} duration={1000}>
          {' '}
          <BasicFeatures />
          {' '}
        </Fade>
      </div>
      <div className="toggle basic-feature-toggle">
        <div className="toggle-label">
          <p>Basic Features</p>
        </div>
        <label className="switch basic-feature-switch">
          <input
            type="checkbox"
            checked={cluiToggle}
            onChange={(e) => {
              setCluiToggle(!cluiToggle);
            }}
          />
          <span className="toggle-slider round" />
        </label>
        <div className="toggle-label">
          <p>All Features (CLUI)</p>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
