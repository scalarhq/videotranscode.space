import React, { useState, useEffect } from 'react';

import { observer } from 'mobx-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { isMobile } from 'react-device-detect';

import ComponentStore from '../../store/componentStore';

import Logo from '../logo';

const Header = () => {
  const { loaded } = ComponentStore;

  const [clicked, setClicked] = useState(0);

  // const [usingLander, setUsingLander] = useState(false);

  useEffect(() => {
    let counter = 0;
    setInterval(() => {
      // Check clicks
      if (loaded) {
        const { hash } = window.location;
        if (hash === '#' || hash === '') {
          if (clicked === 0) {
            ComponentStore.updateLanding(false);
          }
          if (clicked > 0) {
            if (clicked < counter) {
              ComponentStore.updateLanding(false);
            }
          }
        }
      }
      counter += 1;
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header id="header">
      <div className="logo">
        {/* <FontAwesomeIcon icon={Logo} size="2x" /> */}
        <div className="logo-wrapper">
          {' '}
          <Logo />
        </div>
      </div>
      <div className="content">
        <div className="inner" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="flex justify-center">
            <h1 className="landing-title text-3xl font-extrabold text-white">Browser Based Video Transcoder </h1>
          </div>
          <p className="landing-subtitle subpixel-antialiased font-bold" style={{ fontSize: '16px' }}>
            {' '}
            Convert
            {' '}
            <strong className="special-strong">your</strong>
            {' '}
            videos on
            {' '}
            <strong className="special-strong">your</strong>
            {' '}
            machine.
          </p>
          <p className="landing-p subpixel-antialiased" style={{ maxWidth: isMobile ? '' : '70vw', fontSize: '14px', color: 'white' }}>
            A purely browser-based privacy-first video tool capable of performing tasks like converting, compression, etc without uploading your files
          </p>
          {isMobile ? <h3 className="text-xl" style={{ textAlign: 'center', color: 'white', padding: '0 10px' }}>Unfortunately, mobile browser support is extremely limited and not available right now.</h3> : null}

          <div className="start">
            {!isMobile ? (
              <button type="button" className="play-button outline-none" onClick={() => { ComponentStore.updateLanding(false); }}>
                {' '}
                <FontAwesomeIcon icon={faPlay} size="3x" />
              </button>
            )
              : (
                <div className="mobile-options">
                  <a
                    className="link-class typeform-share link middle-footer"
                    href="https://rahultarak12345.typeform.com/to/Fn78Sd"
                    data-mode="drawer_right"
                    style={{
                      color: '#3FBD71', textDecoration: 'underline', fontSize: '20px', textAlign: 'center', padding: '0 10px',
                    }}
                    data-submit-close-delay="0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Be the first to know when mobile support is available!
                  </a>
                  <a style={{ marginTop: '10%' }} href="https://github.com/Etwas-Builders/Video-Transcoder" target="_blank" rel="noopener noreferrer">
                    {' '}
                    <FontAwesomeIcon icon={faGithub} size="3x" />
                  </a>

                </div>
              )}
          </div>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#why" onClick={() => { setClicked(clicked + 1); }}>Why</a>
          </li>
          <li>
            <a href="#features" onClick={() => { setClicked(clicked + 1); }}>Features</a>
          </li>
          <li>
            <a href="https://docs.videotranscode.space/" target="_blank" rel="noopener noreferrer" onClick={() => { setClicked(clicked + 1); }}>Docs</a>
          </li>
          <li>
            <a href="#contact" onClick={() => { setClicked(clicked + 1); }}>Contact</a>
          </li>
        </ul>
      </nav>
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
        .landing-subtitle {
          padding: 10px 0;
        }
        .mobile-options {
          display: flex;
          flex-direction: column;
        }
        .special-strong {
          color: white;
          font-size: 16px;
          font-weight: 800;
        }
        .play-button {
          background-color: transparent;
          color : inherit;
          border: none;
          padding: 2% 3% 0 !important;
          transition: all 0.2s ease-in-out;
          border-radius : 50%;
        }
        .play-button:hover {
          color: #6C63FF;
          transform : rotate(90deg); 
          transform-origin: center center;
        }
        .logo {
          display : flex;
          align-items: center;
          justify-content: center;
          width : ${isMobile ? '30vw !important' : '10vw !important'}; 
          height: ${isMobile ? '30vw !important' : '10vw !important'};
        }
        .logo-wrapper {
          display : flex;
          align-items: center;
          justify-content: center;
          width :${isMobile ? '20vw !important' : '6.5vw !important'}; 
        }
        .start {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        `}
      </style>
    </header>
  );
};

export default observer(Header);
