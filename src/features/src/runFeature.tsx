import React, { useEffect, useState } from 'react';
import FFmpegFeature from '../FFmpegFeature';

import ComponentStore from '../../store/componentStore';

const { CluiStore } = ComponentStore;

const { updateConfiguration } = CluiStore;

type RunConfig = {
  'RUN': { value: string, outputFile: string, [name: string]: any },
  [name: string]: any
}

class RunFeature extends FFmpegFeature {
  configuration: RunConfig

  constructor(configuration: RunConfig) {
    super();
    this.configuration = configuration;
    const { command } = this.parseConfiguration();
    this.setFFmpegCommands(command);
  }

  parseConfiguration = () => {
    const { RUN } = this.configuration;
    return { command: RUN.value, outputFile: RUN.outputFile };
  }

  setFFmpegCommands(command: string) {
    if (command.includes('-i') || command.includes('-o')) {
      throw new Error('Invalid Custom Command, please do not use -i or -o to input or output any files');
    }
    this.ffmpegCommands = command;
  }

  setProgress = () => {
    this.progressBar.name = 'Custom Runner ...';
    this.progressBar.color = 'black';
  }

  setFileConfig = () => {
    this.fileConfig = { types: [{ name: 'video', number: { min: 1, max: -1 } }], primaryType: 'video' };
  }
}

export default RunFeature;

const RunUI = ({ parents }: { parents: Array<string> }) => {
  const [runCommand, setRunCommand] = useState('-crf 30');
  const [outputFile, setOutputFile] = useState('');

  useEffect(() => {
    if (outputFile) {
      updateConfiguration({ value: runCommand, outputFile }, [...parents]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputFile, runCommand]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <p className="text-l font-bold w-full text-white pb-6">This is likely to not work unless you know what you are doing</p>
          <label className="block uppercase tracking-wide text-m font-bold mb-2" htmlFor="run-cmd">
            Custom Run Command
          </label>
          <textarea value={runCommand} onChange={(e) => { setRunCommand(e.target.value); }} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="run-cmd" placeholder="" />
          <p className="text-red-500 text-s italic">Please do not add any input or output files here. No -i or -o</p>
          <p className="text-gray-600 text-s italic">Currently only support one video input file</p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide  text-m font-bold mb-2" htmlFor="run-out">
            Output file name
          </label>
          <input className="appearance-none block w-full bg-white border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none  focus:border-gray-500" id="run-out" type="text" placeholder="output.mp4" value={outputFile} onChange={(e) => { setOutputFile(e.target.value); }} />
        </div>
      </div>
    </div>
  );
};

export { RunUI as RunUi };
