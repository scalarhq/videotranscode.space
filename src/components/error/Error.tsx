import React from 'react';

const ErrorScreen = ({ loadingErrorObj }: { loadingErrorObj: Error }) => (
  <div className="error-wrapper">
    <div className="error-icon">
      <svg viewBox="0 0 32.00199890136719 32" width="24vh" height="24vh"><path xmlns="http://www.w3.org/2000/svg" d="M2.062 32h27.812a2 2 0 0 0 1.766-2.942l-13.876-26A1.997 1.997 0 0 0 16.002 2H16c-.738 0-1.414.406-1.762 1.056L.3 29.056a2.004 2.004 0 0 0 .046 1.972A2.005 2.005 0 0 0 2.062 32zM16 24a2 2 0 1 1-.001 4.001A2 2 0 0 1 16 24zm-2-3.968v-8a2 2 0 0 1 4 0v8a2 2 0 0 1-4 0z" /></svg>
    </div>
    <div className="error-message">
      <h3 style={{ color: '#ff3e00' }}>Oops! Looks like there has been an error.</h3>
      <p>
        Check the error message below and if you think something is wrong, please create an issue
        {' '}
        <a href="https://github.com/Mozilla-Open-Lab-Etwas/Video-Transcoder/issues/new">here</a>
      </p>
      <p style={{ color: 'white' }}>{loadingErrorObj.message}</p>
      <p style={{ color: 'white' }}>
        Your current browser version is
        {' '}
        {window.navigator.userAgent}
      </p>
    </div>
    {/* @ts-ignore Styled JSX */}
    <style jsx>
      {`
      .error-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .error-icon {
        fill: #ff3e00
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
