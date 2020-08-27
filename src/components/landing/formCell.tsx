import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

export default ({ action }: { action: any }) => (
  <article id="contact" key="contact">
    <h2 className="major">Contact</h2>
    <form method="post" action={action}>
      <div className="field half first">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div className="field half">
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea name="message" id="message" />
      </div>
      <ul className="actions">
        <li><input type="submit" value="Send Message" className="special" /></li>
        <li><input type="reset" value="Reset" /></li>
      </ul>
    </form>
    <ul className="icons">
      <li>
        <a href="https://twitter.com/CryogenicPlanet" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} />

        </a>
      </li>
      <li>
        <a href="https://cryogenicplanet.tech/" target="_blank" rel="noopener noreferrer">
          {' '}
          <FontAwesomeIcon icon={faLink} />

        </a>
      </li>
      <li>
        <a href="https://github.com/Etwas-Builders/Video-Transcoder" target="_blank" rel="noopener noreferrer">
          {' '}
          <FontAwesomeIcon icon={faGithub} />

        </a>
      </li>
    </ul>
  </article>

);
