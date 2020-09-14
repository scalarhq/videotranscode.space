import React from 'react';

import ComponentStore from '../../store/componentStore';

const ReloadSvg = ({ width, fill = '#5596ff' }: { width: string, fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width={width} fill={fill}>
    <path
      // fill="#5596ff"
      d="M12.5,21A7.5,7.5,0,0,1,6.713,8.729a.5.5,0,1,1,.771.637A6.5,6.5,0,1,0,12.5,7h-3a.5.5,0,0,1,0-1h3a7.5,7.5,0,0,1,0,15Z"
    />
    <path
      // fill="#5596ff"
      d="M11.5,9a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,.708-.708l2,2A.5.5,0,0,1,11.5,9Z"
    />
    <path
      // fill="#5596ff"
      d="M9.5,7a.5.5,0,0,1-.354-.854l2-2a.5.5,0,0,1,.708.708l-2,2A.5.5,0,0,1,9.5,7Z"
    />
  </svg>
);

const ReloadUtil = () => (
  <div className="reload-utl">
    <button type="button" className="hidden-button tooltip" onClick={() => { ComponentStore.reset(); }}>
      <ReloadSvg width="2rem" fill="rgba(255,255,255,0.6)" />
      <span className="tooltip-text text-xl p-3 -ml-12 rounded">Reset</span>
    </button>
    {/* @ts-ignore Styled JSX */}
    <style jsx>
      {`
        .reload-utl {
          position: fixed;
          top : 2%;
          right : 2%;
        }
        .hidden-button {
          color: inherit;
          background-color: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline;
          padding: 10px;
        }
        `}
    </style>
  </div>
);

export default ReloadUtil;

export { ReloadSvg };
