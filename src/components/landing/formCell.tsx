import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLink, faMailBulk } from '@fortawesome/free-solid-svg-icons';

export default ({ action }: { action: any }) => (
  <article id="contact" key="contact">
    <h2 className="major" style={{ textAlign: 'center' }}>Contact</h2>
    <div className="icon-wrapper">

      <a href="https://twitter.com/CryogenicPlanet" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTwitter} size="3x" />

      </a>

      <a href="https://github.com/Etwas-Builders/Video-Transcoder" target="_blank" rel="noopener noreferrer">
        {' '}
        <FontAwesomeIcon icon={faGithub} size="3x" />

      </a>

      <a href="https://cryogenicplanet.tech/" target="_blank" rel="noopener noreferrer">
        {' '}
        <FontAwesomeIcon icon={faLink} size="3x" />

      </a>

      <a href="mailto:cryogenic@videotranscode.space" target="_blank" rel="noopener noreferrer">
        {' '}
        <FontAwesomeIcon icon={faMailBulk} size="3x" />

      </a>

      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
        .icon-wrapper {
          display: flex;
          justify-content: space-around;
        }
        `}
      </style>
    </div>
  </article>

);
