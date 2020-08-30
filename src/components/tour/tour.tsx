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
    let conductTour = false;
    const tourSession = window.localStorage.getItem('tour');
    console.info(tourSession);
    if (tourSession) {
      const prevDate = new Date(tourSession);
      const currentDate = new Date();
      // @ts-ignore
      const diffTime = Math.abs(currentDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        conductTour = true;
        window.localStorage.removeItem('tour');
      }
    } else {
      conductTour = true;
    }
    if (!landing && conductTour) {
      console.info('Starting Tour!');
      // @ts-ignore
      tour.start();
      window.localStorage.setItem('tour', `${new Date().toISOString()}`);
    }
    // eslint-disable-next-line
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
