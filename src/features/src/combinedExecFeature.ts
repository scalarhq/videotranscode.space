import FFmpegFeature from '../FFmpegFeature';
import features from '../features';
import { WorkflowStep } from '../../dist/workflow';

type CombinedExecConfig = {
  KEY_CONFIG: { value: number, steps: [WorkflowStep] }
  [name: string]: { value: any;[name: string]: any }
}

class CombinedExecFeature extends FFmpegFeature {
  configuration: CombinedExecConfig

  constructor(configuration: CombinedExecConfig) {
    super();
    this.configuration = configuration;
    const featureKeys = this.parseConfiguration();
    let finalFFmpegCommand = '';
    for (const key of featureKeys) {
      const {name} = key
      const CurrentFeature = features[name].feature;
      // @ts-ignore Fix with @lunaroyster later
      const featureObject = new CurrentFeature(configuration);
      finalFFmpegCommand += ` ${featureObject.ffmpegCommands}`;
    }
    this.setFFmpegCommands(finalFFmpegCommand);
  }

  setFFmpegCommands = (ffmpegCommand: string) => {
    this.ffmpegCommands = ffmpegCommand;
  }

  parseConfiguration = () => {
    const { configuration } = this;
    const { KEY_CONFIG } = configuration;
    const { steps } = KEY_CONFIG;
    return steps;
  }

  setProgress = () => {
    this.progressBar.name = 'Processing....';
    this.progressBar.color = '#3FBD71';
  }

  setFileConfig = () => {
    this.fileConfig = { types: [{ name: 'video', number: { min: 1, max: -1 } }], primaryType: 'video' };
  }
}

export default CombinedExecFeature;
