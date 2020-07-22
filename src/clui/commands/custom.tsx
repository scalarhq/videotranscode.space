/* eslint-disable no-param-reassign */


import React, { useEffect, useState } from 'react';
import { CommandType } from './commands';


const CustomComp = (props: any) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);
  }, []);
  useEffect(() => {
    if (count) {
      // After data has loaded, call `next` to show next child (which is another Prompt)
      props.item.next();
    }
  }, [count]);
  return props.ui || 'No ui was provided';
};
const generateCommands = (array: Array<CommandType>) => {
  console.log(array)
  return array.reduce((cur, nex) => {
    // @ts-ignore
    cur[nex.command] = {
      description: nex.description,
    };
    if (nex.child && nex.child.length) {
      // @ts-ignore
      cur[nex.command].commands = () => {
        return generateCommands(nex.child as Array<CommandType>);
      };
    } else {
      // @ts-ignore
      cur[nex.command].run = () => {
        return <CustomComp ui={nex.ui} />;
      };
    }
    return cur;
  }, {});
};

const getFormattedOutput = (data: Array<CommandType>) => {
  return { commands: generateCommands(data) }
}


export default getFormattedOutput