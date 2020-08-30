import React, { useState, useEffect } from 'react';

import { observer } from 'mobx-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPlay } from '@fortawesome/free-solid-svg-icons';

import ComponentStore from '../../store/componentStore';

import { Loader } from '../static/static';

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
        <FontAwesomeIcon icon={faVideo} size="2x" />
      </div>
      <div className="content">
        <div className="inner">
          <h1>Browser Based Video Transcoder</h1>
          <p style={{ fontSize: '16px' }}>
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
          <p style={{ maxWidth: '70vw', fontSize: '12px', color: 'white' }}>
            A video transcoder and converter built using Web Assembly and FFMPEG to transcode and
            convert videos right in your browser while protecting your privacy.
          </p>
          <div className="start">
            {/* {loaded ? ( */}
            <>
              {' '}

              <button type="button" className="play-button" onClick={() => { ComponentStore.updateLanding(false); }}>
                {' '}
                <FontAwesomeIcon icon={faPlay} size="3x" />
              </button>

            </>
            {/* ) : <Loader />} */}
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
        .special-strong {
          color: white;
          font-size: 16px;
          font-weight: 800;
        }
        .play-button {
          background-color: transparent;
          color : inherit;
          border: none;
          padding: 0 3%;
        }
        .logo {
          display : flex;
          align-items: center;
          justify-content: center;
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
