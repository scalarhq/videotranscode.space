import React from 'react';
import { Session } from '@replit/clui-session';
import Prompt from './prompt';
import command from './commands/commands';
import './clui.css';

/**
 * Parent of the entire CLUI Component
 */
const Clui = () => (
  <div className="clui-wrapper">
    <Session>
      <Prompt command={command} />
    </Session>
  </div>
);

export default Clui;
