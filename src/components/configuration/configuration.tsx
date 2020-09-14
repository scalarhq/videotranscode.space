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
        <div className="clui-transition">
          <Fade right opposite when={cluiToggle} duration={1000}>
            <Clui />
          </Fade>
        </div>
        <div className="basic-transition">
          <Fade right collapse opposite when={!cluiToggle} duration={1000}>
            {' '}
            <BasicFeatures />
            {' '}
          </Fade>
        </div>
        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
          .clui-transition {
            display : ${cluiToggle ? 'block' : 'none'};
            transition: display 1s linear;
          }
          .basic-transition {
            display : ${!cluiToggle ? 'block' : 'none'};
            transition: display 1s linear;
          }
          `}
        </style>
      </div>
      <div className="relative">
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
    </div>
  );
};

export default Configuration;
