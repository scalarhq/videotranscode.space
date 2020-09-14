import React, { useEffect, useState } from 'react';

import { observer, useObserver } from 'mobx-react';

import ComponentStore from '../store/componentStore';

/**
 * Basic Submit button that tells store that configuration is locked
 */
const Submit = observer(() => {
  const { CluiStore, FileStore, loaded } = ComponentStore;

  const { setSubmitStatus } = CluiStore;

  const { allFiles } = FileStore;

  const submit = React.useRef<HTMLButtonElement | null>(null);

  const [disabledTip, setTip] = useState('Please wait while FFmpeg loads in the background, the entire process can take up to 30 seconds');

  const handleSubmit = () => {
    setSubmitStatus(true);
  };

  useEffect(() => {
    if (loaded && allFiles.length === 0) {
      setTip('Please Add A File!');
    }
    if (loaded && allFiles.length > 0) {
      if (submit && submit.current) {
        submit.current.removeAttribute('data-tooltip');
      }
    }
    // eslint-disable-next-line
  }, [loaded, allFiles, submit, submit.current]);

  return useObserver(() => (
    <>
      <button className={`text-white font-bold py-2 px-4 mb-12 rounded ${!loaded || allFiles.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'} `} data-tooltip={disabledTip} ref={submit} type="submit" onClick={handleSubmit} disabled={!loaded || allFiles.length === 0}>
        Submit
        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
          /**
            * Tooltip Styles
            */

            /* Add this attribute to the element that needs a tooltip */
            [data-tooltip] {
              position: relative;
              z-index: 2;
              cursor: pointer;
            }

            /* Hide the tooltip content by default */
            [data-tooltip]:before,
            [data-tooltip]:after {
              visibility: hidden;
              -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
              filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
              opacity: 0;
              pointer-events: none;
            }

            /* Position tooltip above the element */
            [data-tooltip]:before {
              position: absolute;
              bottom: 150%;
              left: 50%;
              margin-bottom: 5px;
              margin-left: -8vw;
              padding: 7px;
              width: 20vw;
              -webkit-border-radius: 3px;
              -moz-border-radius: 3px;
              border-radius: 3px;
              background-color: #000;
              background-color: hsla(0, 0%, 20%, 1);
              color: #fff;
              content: attr(data-tooltip);
              text-align: center;
              font-size: 14px;
              line-height: 1.2;
            }

            /* Triangle hack to make tooltip look like a speech bubble */
            [data-tooltip]:after {
              position: absolute;
              bottom: 150%;
              left: 50%;
              margin-left: -5px;
              width: 0;
              border-top: 5px solid #000;
              border-top: 5px solid hsla(0, 0%, 20%, 1);
              border-right: 5px solid transparent;
              border-left: 5px solid transparent;
              content: " ";
              font-size: 0;
              line-height: 0;
            }

            /* Show tooltip content on hover */
            [data-tooltip]:hover:before,
            [data-tooltip]:hover:after {
              visibility: visible;
              -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
              filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
              opacity: 1;
            }
          `}
        </style>
      </button>
    </>
  ));
});

export default Submit;
