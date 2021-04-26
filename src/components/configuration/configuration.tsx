/* eslint-disable jsx-a11y/label-has-associated-control */

import Workflow from '@components/workflow/workflow'
import CluiStore from '@store/cluiStore'
import styles from '@styles/configuration.module.css'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
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

  const keyMap = {
    TOGGLE_MODES: ['alt+c']
  }

  const handlers = {
    TOGGLE_MODES: () => {
      setCluiToggle(c => !c)
    }
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      <div
        className={styles['configuration-wrapper']}
        id="configuration-wrapper">
        <div className={styles.config}>
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
          <div className={classNames(styles.toggle, 'basic-feature-toggle')}>
            <div className={styles['toggle-label']}>
              <p className="text-green-500">Normal</p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={cluiToggle}
                onChange={() => {
                  setCluiToggle(!cluiToggle)
                }}
              />
              <span
                className={classNames(styles.round, styles['toggle-slider'])}
              />
            </label>
            <div className={styles['toggle-label']}>
              <p className="text-green-500">Advanced(CLUI)</p>
            </div>
          </div>
        </div>
      </div>
    </GlobalHotKeys>
  )
}

export default Configuration
