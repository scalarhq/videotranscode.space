import React, { useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';

import { faFile, faCogs, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import useHover from '../../ts/useHover';

import ComponentStore from '../../store/componentStore';

const HelpSvg = ({ width }: { width: string }) => (
  <svg width={width} xmlns="http://www.w3.org/2000/svg" fill="rgba(255,255,255,0.6)" viewBox="0 0 24 24"><path d="M11.29,15.29a1.58,1.58,0,0,0-.12.15.76.76,0,0,0-.09.18.64.64,0,0,0-.06.18,1.36,1.36,0,0,0,0,.2.84.84,0,0,0,.08.38.9.9,0,0,0,.54.54.94.94,0,0,0,.76,0,.9.9,0,0,0,.54-.54A1,1,0,0,0,13,16a1,1,0,0,0-.29-.71A1,1,0,0,0,11.29,15.29ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,7A3,3,0,0,0,9.4,8.5a1,1,0,1,0,1.73,1A1,1,0,0,1,12,9a1,1,0,0,1,0,2,1,1,0,0,0-1,1v1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,12,7Z" /></svg>
);

const HoverGuide = () => (
  <div className="hover-help-wrapper">
    <div className="flex ">
      <div className="w-1/2 hover-file-wrapper ">
        <div className="max-w-sm w-full lg:max-w-full lg:flex">
          <div className="hover-card rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div className="text-white font-bold text-xl mb-2">
                <FontAwesomeIcon icon={faFile} />
                {' '}
                Add Files
              </div>
              <p className="text-white text-base">Drag and drop as many files as you want here.</p>
              {' '}
              <p className="text-white text-base">  Videos, Audio and Images are accepted. </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-1/3" /> */}
      <div className="w-1/2 hover-clui-wrapper">
        <div className="max-w-sm w-full lg:max-w-full lg:flex justify-end">
          <div className="hover-card rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div className="text-white font-bold text-xl mb-2">
                <FontAwesomeIcon icon={faCogs} />
                {' '}
                Configuration
              </div>
              <p className="text-white text-base">
                Choose a Feature -
                {'>'}
                {' '}
                Set your options -
                {'>'}
                {' '}
                Submit
              </p>
              {' '}
              <p />
              <p className="text-white text-base">Workflows are multiple features combined! </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex">
      <div className="w-1/2" />
      <div className="w-1/2 hover-toggle-wrapper ">
        <div className="hover-toggle">
          <div className="max-w-sm w-full lg:max-w-full lg:flex justify-center">
            <div className="hover-card rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
              <div className="mb-8">
                <div className="text-white font-bold text-xl mb-2">
                  <FontAwesomeIcon icon={faToggleOn} />
                  {' '}
                  Intimated by the CLUI?
                </div>
                <p className="text-white text-base">
                  Don't
                  {' '}
                  understand the CLUI? No problem, just click the toggle!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* @ts-ignore Styled JSX */}
    <style jsx>
      {`
      .hover-card {
        background-color: rgba(0,0,0,0.8);
      }
      .hover-file-wrapper {
        height: 40vh;
        justify-content: center;
        align-items: center;
        display: flex;
        margin-top: 15vh;

      }
      .hover-clui-wrapper {
        height: 40vh;
        justify-content: center;
        align-items: center;
        display: flex;
        margin-top: 15vh;
      }
      .hover-toggle {
        margin-top: 15vh;
      }

      .hover-help-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(4px);
        padding: 5vh 11vw;
      }
    

/* .hover-container .hover-display {
  visibility: hidden;
} */


{/* .hover-container:hover .hover-display:not(:hover) {
  visibility: visible;
  /* transition-delay: 1s; */
}}
      `}
    </style>
  </div>
);

const HelpUtl = () => {
  const [hoverRef, isHovered] = useHover();
  const hoverDisplay = useRef<HTMLDivElement | null>(null);

  const { CluiStore } = ComponentStore;

  const { isSubmitted } = CluiStore;

  useEffect(() => {
    // console.info('Hover change ', isHovered);
    if (!isHovered) {
      setTimeout(() => {
        if (hoverDisplay && hoverDisplay.current) {
          hoverDisplay.current.style.visibility = 'hidden';
        }
      }, 1000);
    } else if (hoverDisplay && hoverDisplay.current) {
      hoverDisplay.current.style.visibility = 'visible';
    }
  }, [isHovered]);
  if (!isSubmitted) {
    return (

      <div>
        <div className="help-utl">
          <div className="hover-container">
            {/* @ts-ignore */}
            <div className="hoverable" ref={hoverRef}><HelpSvg width="2rem" /></div>
            <div className="hover-display" ref={hoverDisplay}>
              <HoverGuide />
            </div>
          </div>

          {/* @ts-ignore Styled JSX */}
          <style jsx>
            {`
        

        .help-utl {
          position: fixed;
          top : 2%;
          left : 2%;
          z-index: 100;
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

          .hover-container .hover-display {
          
            visibility : hidden;
            transition: all 0.5s;
          }

       
        `}
          </style>
        </div>
      </div>
    );
  }
  return <div />;
};
export default observer(HelpUtl);
