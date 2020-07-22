import clear from './clear';
import custom from './custom';
import workflows from '../../dist/workflow';
import data from './data';

type CommandType = {
  command: string;
  description: string;
  ui: JSX.Element | string;
  child?: Array<CommandType>;
};

const generateWorkflows: () => Array<CommandType> = () => {
  const finalWorkflows: Array<CommandType> = [];
  const workflowsArray = Object.values(workflows);
  workflowsArray.forEach((workflow) => {
    const newWorkflow: CommandType = {
      command: workflow.name,
      description: workflow.description,
      ui: 'default UI component ',
    };
    if (workflow.ui) {
      newWorkflow.ui = workflow.ui;
    }
    if (workflow.child) {
      newWorkflow.child = workflow.child;
    }
    finalWorkflows.push(newWorkflow);
  });
  return finalWorkflows;
};

const command = {
  commands: {
    clear,
    workflows: custom(generateWorkflows()),

    // @ts-ignore
    // customData: custom.commands(data),
  },
};

export default command;

// eslint-disable-next-line no-undef
export type { CommandType };
