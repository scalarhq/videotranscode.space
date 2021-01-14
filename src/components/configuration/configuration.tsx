/* eslint-disable jsx-a11y/label-has-associated-control */

import Workflow from '@components/workflow/workflow'
import CluiStore from '@store/cluiStore'
import React, { useEffect, useState } from 'react'
import { Fade } from 'react-reveal'

import Clui from '../../clui/clui'

const Configuration = () => {
  const [cluiToggle, setCluiToggle] = useState(false)

  useEffect(() => {
    const cluiToggleStorage = window.localStorage.getItem('clui-toggle')
    const cluiToggleSession: {
      setting?: boolean
      expiry?: string
    } = cluiToggleStorage ? JSON.parse(cluiToggleStorage) : {}

    console.info('Session Data', cluiToggleSession, cluiToggleStorage)

    if (cluiToggleSession.setting !== undefined && cluiToggleSession.expiry) {
      const prevDate = new Date(cluiToggleSession.expiry)
      const currentDate = new Date()
      // @ts-ignore
      const diffTime = Math.abs(currentDate - prevDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 30) {
        setCluiToggle(true)
        window.localStorage.removeItem('clui-toggle')
      } else {
        setCluiToggle(cluiToggleSession.setting)
        window.localStorage.setItem(
          'clui-toggle',
          JSON.stringify({
            setting: cluiToggleSession.setting,
            expiry: new Date().toISOString()
          })
        )
      }
    } else {
      setCluiToggle(false)
      window.localStorage.setItem(
        'clui-toggle',
        JSON.stringify({ setting: false, expiry: new Date().toISOString() })
      )
    }

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    CluiStore.updateCluiToggle(cluiToggle)
    window.localStorage.setItem(
      'clui-toggle',
      JSON.stringify({ setting: cluiToggle, expiry: new Date().toISOString() })
    )
  }, [cluiToggle])

  return (
    <div className="configuration-wrapper">
      <div className="config">
        <div className="clui-transition">
          <Fade right opposite when={cluiToggle} duration={1000}>
            <Clui />
          </Fade>
        </div>
        <div className="basic-transition">
          <Fade right opposite when={!cluiToggle} duration={1000}>
            <Workflow />
          </Fade>
        </div>

        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
            .clui-transition {
              display: ${cluiToggle ? 'block' : 'none'};
              transition: display 1s linear;
            }
            .basic-transition {
              display: ${!cluiToggle ? 'block' : 'none'};
              transition: display 1s linear;
            }
          `}
        </style>
      </div>
      <div className="relative">
        <div className="toggle basic-feature-toggle">
          <div className="toggle-label">
            <p>Normal</p>
          </div>
          <label className="switch basic-feature-switch">
            <input
              type="checkbox"
              checked={cluiToggle}
              onChange={() => {
                setCluiToggle(!cluiToggle)
              }}
            />
            <span className="toggle-slider round" />
          </label>
          <div className="toggle-label">
            <p>Advanced(CLUI)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Configuration
