import clear from './clear';
import custom from './custom';
import workflows from '../../dist/workflow';
import features, { Feature } from '../../features/features';

type CommandType = {
  command: string;
  description: string;
  ui: JSX.Element | string;
  child?: Array<CommandType>;
  steps: Array<string | Feature>;
};

const generateWorkflows: () => Array<CommandType> = () => {
  const finalWorkflows: Array<CommandType> = [];
  const workflowsArray = Object.values(workflows);
  for (const workflow of workflowsArray) {
    const newWorkflow: CommandType = {
      command: workflow.name,
      description: workflow.description,
      ui: 'default UI component ',
      steps: workflow.steps,
    };
    if (workflow.ui) {
      newWorkflow.ui = workflow.ui;
    }
    if (workflow.child) {
      newWorkflow.child = workflow.child;
    }
    finalWorkflows.push(newWorkflow);
  }
  return finalWorkflows;
};

const generateFeatures: () => Array<CommandType> = () => {
  const finalFeatures: Array<CommandType> = [];
  const featureKeys = Object.keys(features);
  for (const key of featureKeys) {
    const currentFeature = features[key];
    const newFeature: CommandType = {
      command: key as string,
      description: currentFeature.description,
      ui: currentFeature.ui,
      steps: [currentFeature.feature],
    };
    finalFeatures.push(newFeature);
  }
  return finalFeatures;
};

const command = {
  commands: {
    Workflows: { description: 'Automated Workflows', ...custom(generateWorkflows()) },
    Feature: { description: 'All Available Features', ...custom(generateFeatures()) },
    Clear: clear,
  },
};

export default command;

// eslint-disable-next-line no-undef
export type { CommandType };
