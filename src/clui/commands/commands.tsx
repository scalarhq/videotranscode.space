import React from 'react';
import clear from './clear';
import custom from './custom';
import workflows from '../../dist/workflow';
import features, { Feature } from '../../features/features';

import WorkflowUi from '../components/workflow-ui';
import FeatureUi from '../components/feature-ui';

type CommandType = {
  command: string;
  description: string;
  ui: JSX.Element | string;
  child?: Array<CommandType>;
  steps: Array<string | Feature>;
};

/**
 * Generates the CLUI command for all workflows and passes to custom ui component
 * Uses {@link WorkflowUi} to generate UI for workflows
 */
const generateWorkflows: () => Array<CommandType> = () => {
  const finalWorkflows: Array<CommandType> = [];
  const workflowsArray = Object.values(workflows);
  for (const workflow of workflowsArray) {
    const newWorkflow: CommandType = {
      command: workflow.name,
      description: workflow.description,
      ui: (<WorkflowUi steps={workflow.steps} />),
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
/**
 * Generates CLUI command for all Features and passes it to custom component
 * Uses {@link FeatureUi} to generate UI for all Features
 */
const generateFeatures: () => Array<CommandType> = () => {
  const finalFeatures: Array<CommandType> = [];
  const featureKeys = Object.keys(features);
  for (const key of featureKeys) {
    const currentFeature = features[key as keyof typeof features];
    const newFeature: CommandType = {
      command: key as string,
      description: currentFeature.description,
      ui: (<FeatureUi ui={currentFeature.ui} />),
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
