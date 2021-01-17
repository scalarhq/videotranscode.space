import { Session } from '@replit/clui-session'
import CluiStore from '@store/cluiStore'
import styles from '@styles/clui.module.css'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'

import command from './commands/commands'
import Prompt from './prompt'

/**
 * Parent of the entire CLUI Component
 */
const Clui = () => {
  const { setCluiFocused, cluiToggle } = CluiStore

  const handleFocusTransfer = () => {
    setCluiFocused(true)
  }

  return (
    <div className={styles['clui-wrapper']}>
      <div className={styles['clui-overlay']} onClick={handleFocusTransfer}>
        <Session>
          <Prompt command={command} autoFocus={cluiToggle} />
        </Session>
      </div>
      <div
        className={classNames(
          styles['clui-background'],
          'flex flex-col justify-center h-full'
        )}>
        <div className="flex justify-end">
          <div className="w-1/2">
            {CluiStore.ran ? null : (
              <img alt="Setting Svg" src="images/preferences.svg" />
            )}
            {/* <img src="images/undraw_set_preferences_kwia.svg" /> */}
          </div>
        </div>
      </div>
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .clui-wrapper {
            cursor: ${CluiStore.ran ? 'default' : 'text'};
          }
        `}
      </style>
    </div>
  )
}

export default observer(Clui)
