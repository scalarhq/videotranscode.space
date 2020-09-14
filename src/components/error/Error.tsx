import React from 'react';
import newGithubIssueUrl from 'new-github-issue-url';

import { ReloadSvg } from '../utils/reload';

const ErrorScreen = ({ errorObj, componentStack }: { errorObj?: Error, componentStack?: string }) => (
  <div className="error-wrapper">
    <p className="text-3xl" style={{ color: 'white', textAlign: 'center', marginTop: '5vh' }}>Oops! Something went wrong</p>
    <p className="text-xl" style={{ color: 'white', textAlign: 'center', fontWeight: 'lighter' }}>Often, reloading the page will fix this error.</p>

    <div className="error-icon">
      <button type="button" className="transparent-button" onClick={() => { window.location.reload(); }}><ReloadSvg width="15rem" /></button>
    </div>
    <div className="error-message">

      <p style={{ color: 'white' }}>{errorObj?.message ? errorObj.message : 'Unknown Error'}</p>
      <pre style={{ color: 'white' }}>{componentStack}</pre>
      <p style={{ color: 'white', fontSize: '14px' }}>
        Your current browser version is
        {' '}
        {window.navigator.userAgent}
      </p>
      <p>
        Check the error message above and if you think something is wrong, please create an issue
        {' '}
        <a
          href={newGithubIssueUrl({
            user: 'Etwas-Builders', repo: 'Video-Transcoder', body: `\n\n\n-----\n Browser Version: ${window.navigator.userAgent} \n\n-----\n **Error Message : ${errorObj?.message ? errorObj.message : 'Unknown Error'}** \n\n-----\n Call Stack : ${componentStack}`, title: '[BUG] [CRASH]', labels: ['bug', 'crash-report'],
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
      <p>
        We support the following browsers, you can find the full detailed list
        {' '}
        <a href="https://caniuse.com/#feat=sharedarraybuffer" target="_blank" rel="noopener noreferrer">here</a>
      </p>
      <a href="https://caniuse.com/#feat=sharedarraybuffer" target="_blank" rel="noopener noreferrer">
        <picture className="picture-wrapper">
          <source type="image/webp" srcSet="/images/support/browserSupport.webp" />
          <source type="image/png" srcSet="/images/support/browserSupport.png" />
          <img className="img-class" src="/images/support/browserSupport.jpg" alt="Data on support for the SharedArrayBuffer feature across the major browsers from caniuse.com" />
        </picture>
      </a>
    </div>
    <div className="final" />
    {/* @ts-ignore Styled JSX */}
    <style jsx>
      {`
       .final {
        padding-bottom: 20vh;
      }
      .picture-wrapper {
        max-width: 80vw;
        object-fit : cover;
      }
      .img-class {
        max-width: 80vw;
        object-fit : cover;
      }
      .error-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .error-icon {
        fill: grey;
      }
      .error-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size : 20px;
        max-width: 80vw;
        text-align: center;
      
      }
      .error-message a {
        color: white;
      }
      .transparent-button {
        background-color : transparent;
        border: none;
      }
      `}
    </style>
  </div>
);

export default ErrorScreen;
