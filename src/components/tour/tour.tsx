import React, { useContext, useEffect } from 'react';

import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';

import steps from './steps';

import 'shepherd.js/dist/css/shepherd.css';

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
  scrollTo: { behavior: 'smooth', block: 'center' },
};

type TourProps = { children: JSX.Element, landing: boolean }

const Tour = ({ children, landing }: TourProps) => {
  const tour = useContext(ShepherdTourContext);

  useEffect(() => {
    console.info('Updated landing', landing);
    if (!landing) {
      console.info('Starting Tour!');
      // @ts-ignore
      tour.start();
    }
  }, [landing]);

  return (
    <div>{children}</div>
  );
};

const TourWrapper = ({ children, landing }: TourProps) => (
  <div>
    {/* @ts-ignore Tour Step */}
    <ShepherdTour steps={steps} tourOptions={tourOptions}>
      <Tour landing={landing}>{children}</Tour>
    </ShepherdTour>
  </div>
);

export default TourWrapper;
