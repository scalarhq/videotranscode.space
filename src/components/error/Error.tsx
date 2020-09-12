import React from 'react';
import newGithubIssueUrl from 'new-github-issue-url';

const ReloadSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="15rem">
    <path
      fill="#5596ff"
      d="M12.5,21A7.5,7.5,0,0,1,6.713,8.729a.5.5,0,1,1,.771.637A6.5,6.5,0,1,0,12.5,7h-3a.5.5,0,0,1,0-1h3a7.5,7.5,0,0,1,0,15Z"
    />
    <path
      fill="#5596ff"
      d="M11.5,9a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,.708-.708l2,2A.5.5,0,0,1,11.5,9Z"
    />
    <path
      fill="#5596ff"
      d="M9.5,7a.5.5,0,0,1-.354-.854l2-2a.5.5,0,0,1,.708.708l-2,2A.5.5,0,0,1,9.5,7Z"
    />
  </svg>
);

const ErrorScreen = ({ errorObj, componentStack }: { errorObj?: Error, componentStack?: string }) => (
  <div className="error-wrapper">
    <p className="text-3xl" style={{ color: 'white', textAlign: 'center', marginTop: '5vh' }}>Oops! Something went wrong</p>
    <p className="text-xl" style={{ color: 'white', textAlign: 'center', fontWeight: 'lighter' }}>Often, reloading the page will fix this error.</p>

    <div className="error-icon">
      <button type="button" className="transparent-button" onClick={() => { window.location.reload(); }}><ReloadSvg /></button>
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
