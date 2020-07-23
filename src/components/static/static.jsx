import React from 'react';
import './static.css';

export function Loader() {
  return (
    <div id="loader" className="row justify-content-md-center">
      <div className="col col-auto-md">
        <div className="lds-facebook" id="inner-loader">
          <div />
          <div />
          <div />
        </div>
        <p className="lead" id="message" style={{ color: 'white' }} />
      </div>
    </div>
  );
}

export function Header() {
  return (
    <div className="header">
      <h1 className="title">Browser Based Video Transcoder</h1>
      <h4>
        Your files will not be uploaded anywhere, all processing will be done on your browser.
      </h4>
    </div>
  );
}

export function Footer() {
  return (
    <div className="footer">
      <a
        href="https://github.com/Mozilla-Open-Lab-Etwas/Video-Transcoder"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-icon"
      >
        <i className="fa fa-github" />
      </a>
      <a
        className="typeform-share link"
        href="https://rahultarak12345.typeform.com/to/Fn78Sd"
        data-mode="drawer_right"
        style={{ color: '#3FBD71', textDecoration: 'underline', fontSize: '20px' }}
        data-submit-close-delay="0"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join our Mail List!
      </a>
      {/* <ReactTypeformEmbed url="https://rahultarak12345.typeform.com/to/Fn78Sd" popup={true} buttonText="Mailing List!" mode="drawer_right" style={{ color: "#3FD71", textDecoration: "underline", fontSize: "20px" }} >Join the mailing list!</ReactTypeformEmbed> */}
      <div className="wasm-wrapper">
        <div className="extra">
          <p style={{ fontSize: '20px', paddingRight: '3%' }}>Powered by</p>
          <a href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#654ff0">
              <path
                d="M39.32 0v.345a7.34 7.34 0 0 1-7.338 7.338A7.34 7.34 0 0 1
            24.644.345V0H0v64h64V0zm-8.778 57.15l-3.116-15.42h-.054L24
            57.15h-4.294L14.84 34.493h4.24l2.902
            15.42h.054l3.497-15.42H29.5l3.14 15.6h.054l3.312-15.6h4.163L34.765
            57.15zm23.347 0l-1.445-5.043h-7.63l-1.112
            5.043h-4.24l5.483-22.657h6.7L58.31 57.15zm-4.607-17.074h-1.784l-1.85
            8.314h5.757z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
