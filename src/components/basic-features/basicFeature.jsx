import React, { useState, useEffect } from 'react';

import features from '../../features/features';

import Submit from '../../clui-ui-components/Submit';

import ComponentStore from '../../store/componentStore';

const { CluiStore } = ComponentStore;

const { updateChosenFeatures } = CluiStore;

const { TRANSCODE, COMPRESS } = features;

/**
 * Basic Feature UI/UX to toggle away from CLUI for users uncomfortable
 */
const BasicFeatures = () => {
  const [transcodeToggle, setToggled] = useState(false);

  useEffect(() => {
    const featureKey = transcodeToggle ? 'COMPRESS' : 'TRANSCODE';
    updateChosenFeatures([featureKey]);
  }, [transcodeToggle]);

  return (
    <div className="basic-feature-wrapper">
      <div className="toggle">
        <div className="toggle-label">
          <p>Convert (Transcode)</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={transcodeToggle}
            onChange={(e) => {
              setToggled(!transcodeToggle);
            }}
          />
          <span className="toggle-slider round" />
        </label>
        <div className="toggle-label">
          <p>Compress (Reduce File Size)</p>
        </div>
      </div>
      <div className="single-feature-wrapper">{transcodeToggle ? COMPRESS.ui : TRANSCODE.ui}</div>
      <div className="row">
        <Submit />
      </div>
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .single-feature-wrapper {
            padding-top: 3vh;
          }
          .row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
          }
          .options-list-wrapper {
            padding-top: 0rem !important;
            padding-bottom: 0rem !important;
          }
          .basic-feature-wrapper {
            display: flex;
            flex-direction: column;
            width: 40vw;
            height: 100%;
          }

          .toggle {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
          .toggle-label {
            padding: 0 2%;
            font-weight: 400;
          }

          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          .toggle-slider:before {
            position: absolute;
            content: '';
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          input:checked + .toggle-slider {
            background-color: #6c63ff;
          }

          input:focus + .toggle-slider {
            box-shadow: 0 0 1px #2196f3;
          }

          input:checked + .toggle-slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
          }

          /* Rounded sliders */
          .toggle-slider.round {
            border-radius: 34px;
          }

          .toggle-slider.round:before {
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
};

export default BasicFeatures;
