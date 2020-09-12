import React from 'react';

import CluiStore from '../../store/cluiStore';

const Clear = (props: any) => {
  React.useEffect(() => {
    if (props.item) {
      props.item.session.reset();
    }
    CluiStore.updateRun(false);

    window.scrollTo({ top: 0, left: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div />;
};

export default {
  description: 'Clears screen',
  run: () => <Clear />,
};
