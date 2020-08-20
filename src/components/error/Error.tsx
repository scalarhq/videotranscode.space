import React from 'react';
import newGithubIssueUrl from 'new-github-issue-url';

const ErrorScreen = ({ loadingErrorObj }: { loadingErrorObj: Error }) => (
  <div className="error-wrapper">
    <h1 style={{ color: 'white', textAlign: 'center' }}>Oops! Something went wrong</h1>
    <div className="error-icon">
      {/* <svg viewBox="0 0 32.00199890136719 32" width="24vh" height="24vh"><path xmlns="http://www.w3.org/2000/svg" d="M2.062 32h27.812a2 2 0 0 0 1.766-2.942l-13.876-26A1.997 1.997 0 0 0 16.002 2H16c-.738 0-1.414.406-1.762 1.056L.3 29.056a2.004 2.004 0 0 0 .046 1.972A2.005 2.005 0 0 0 2.062 32zM16 24a2 2 0 1 1-.001 4.001A2 2 0 0 1 16 24zm-2-3.968v-8a2 2 0 0 1 4 0v8a2 2 0 0 1-4 0z" /></svg> */}
      <svg xmlns="http://www.w3.org/2000/svg" width="24vh" height="24vh" viewBox="0 0 24 24">
        <g data-name="Layer 2">
          <g data-name="alert-circle">
            <rect width="24" height="24" opacity="0" />
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            <circle cx="12" cy="16" r="1" />
            <path d="M12 7a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z" />
          </g>
        </g>
      </svg>
    </div>
    <div className="error-message">

      <p style={{ color: 'white' }}>{loadingErrorObj?.message ? loadingErrorObj.message : 'Unknown Error'}</p>
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
            user: 'Etwas-Builders', repo: 'Video-Transcoder', body: `\n\n\n-----\n Browser Version: ${window.navigator.userAgent} \n\n-----\n **Error Message : ${loadingErrorObj?.message ? loadingErrorObj.message : 'Unknown Error'}**`, title: '[BUG] [CRASH]', labels: ['bug', 'crash-report'],
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
          <img className="img-class" src="/images/support/browserSupport.jpg" alt="Data on support for the sharedarraybuffer feature across the major browsers from caniuse.com" />
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
      `}
    </style>
  </div>
);

export default ErrorScreen;
