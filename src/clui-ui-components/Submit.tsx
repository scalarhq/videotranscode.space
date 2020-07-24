import React from 'react';

import ComponentStore from '../store/componentStore';

const { CluiStore } = ComponentStore;

const { setSubmitStatus } = CluiStore;

const Submit = () => {
  const handleSubmit = () => {
    setSubmitStatus(true);
  };

  return (
    <button className="submitButton" type="submit" onClick={handleSubmit}>
      Submit
    </button>
  );
};

export default Submit;
