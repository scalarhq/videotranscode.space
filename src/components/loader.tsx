import React from 'react';

export default function Loader() {
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
