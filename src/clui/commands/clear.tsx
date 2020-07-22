import React from 'react';

const Clear = (props: any) => {
  React.useEffect(() => {
    if (props.item) {
      props.item.session.reset();
    }

    window.scrollTo({ top: 0, left: 0 });
  }, []);

  return <div />;
};

export default {
  description: 'Clears screen',
  run: () => <Clear />,
};
