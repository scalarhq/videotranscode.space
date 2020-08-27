import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPlay } from '@fortawesome/free-solid-svg-icons';

import ComponentStore from '../../store/componentStore';

export default () =>
  // let alt = props.alt || "image avatar";
  (
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
            <h3 className="special-strong" style={{ fontSize: '30px' }}>Start</h3>
            <button type="button" className="play-button" onClick={() => { ComponentStore.updateLanding(false); }}>
              {' '}
              <FontAwesomeIcon icon={faPlay} size="3x" />
            </button>
            <h3 className="special-strong" style={{ fontSize: '30px' }}>Now!</h3>
          </div>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#intro">Why</a>
          </li>
          <li>
            <a href="#work">Features</a>
          </li>
          <li>
            <a href="https://docs.videotranscode.space/" target="_blank" rel="noopener noreferrer">Docs</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
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
          color : white;
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
