/* global JSX */

import ComponentStore from '@store/componentStore'
import React, { useContext, useEffect } from 'react'
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'

import steps from './steps'

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    classes: 'shepherd-font'
  },
  useModalOverlay: true,
  scrollTo: { behavior: 'smooth', block: 'center' }
}

type TourProps = { children: JSX.Element }

const Tour = ({ children }: TourProps) => {
  const tour = useContext(ShepherdTourContext)

  useEffect(() => {
    let conductTour = false
    const tourSession = window.localStorage.getItem('tour')
    // console.info(tourSession);
    if (tourSession) {
      const prevDate = new Date(tourSession)
      const currentDate = new Date()
      // @ts-ignore
      const diffTime = Math.abs(currentDate - prevDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 30) {
        conductTour = true
        window.localStorage.removeItem('tour')
      }
    } else {
      conductTour = true
    }
    if (conductTour) {
      // @ts-ignore
      tour.start()
      window.localStorage.setItem('tour', `${new Date().toISOString()}`)
    }

    ComponentStore.startTour = tour ? tour.start : () => {}

    return () => {
      ComponentStore.startTour = () => {}
    }

    // eslint-disable-next-line
  }, [])

  return <div>{children}</div>
}

const TourWrapper = ({ children }: TourProps) => (
  <div>
    {/* @ts-ignore Tour Step */}
    <ShepherdTour steps={steps} tourOptions={tourOptions}>
      <Tour>{children}</Tour>
    </ShepherdTour>
  </div>
)

export default TourWrapper
