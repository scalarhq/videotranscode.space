import React from 'react';
import { Session } from '@replit/clui-session';
import Prompt from './prompt';
import command from './commands/commands';
import './clui.css';

const Clui = () => (
  <div className="clui-wrapper">
    <Session>
      <Prompt command={command} />
    </Session>
    {/*
    // @ts-ignore */}

  </div>
);

export default Clui;
