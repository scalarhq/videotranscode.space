import React from 'react';

import ComponentStore from '../../store/componentStore';

const DirectExecute = ({ featureKey }: { featureKey: string }) => {
  const { CluiStore, loaded } = ComponentStore;

  const { setSubmitStatus, updateChosenFeatures } = CluiStore;

  React.useEffect(() => {
    if (loaded) {
      updateChosenFeatures([featureKey]);
      setSubmitStatus(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  if (loaded) {
    return <div />;
  }
  return <h3 style={{ color: 'white' }}>Loading FFmpeg....</h3>;
};

export default DirectExecute;
