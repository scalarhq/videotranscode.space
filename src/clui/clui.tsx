import React from 'react'
import { Session } from '@replit/clui-session'

import { observer } from 'mobx-react'
import Prompt from './prompt'
import command from './commands/commands'
import './clui.css'

import CluiStore from '../store/cluiStore'

/**
 * Parent of the entire CLUI Component
 */
const Clui = () => (
  <div className="clui-wrapper">
    <div className="clui-overlay">
      <Session>
        <Prompt command={command} />
      </Session>
    </div>
    <div className="clui-background flex flex-col justify-center h-full">
      <div className="flex justify-end">
        <div className="w-1/2">
          {CluiStore.ran ? null : (
            <img alt="Setting Svg" src="images/preferences.svg" />
          )}
          {/* <img src="images/undraw_set_preferences_kwia.svg" /> */}
        </div>
      </div>
    </div>
  </div>
)

export default observer(Clui)
