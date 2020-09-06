import React, { useEffect } from 'react';

import CluiStore from '../../store/cluiStore';

const { setSubmitStatus } = CluiStore;

const DirectExecute = (props: any) => {
  React.useEffect(() => {
    setSubmitStatus(true);
  }, []);

  return <div />;
};

export default DirectExecute;
