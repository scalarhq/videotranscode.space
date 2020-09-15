import React, { useState, useEffect } from 'react';

import { Fraction } from 'fractional';
import FFmpegFeature from '../FFmpegFeature';

import ComponentStore from '../../store/componentStore';

const { CluiStore } = ComponentStore;

const { updateConfiguration } = CluiStore;

type AspectRatioConfig = {
  'ASPECT_RATIO': { value: number, [name: string]: any, 'HEIGHT': { value: number }, 'WIDTH': { value: number } },
  [name: string]: any
}

class AspectRatioFeature extends FFmpegFeature {
  configuration: AspectRatioConfig

  constructor(configuration: AspectRatioConfig) {
    super();
    this.configuration = configuration;
    const { aspectRatio, width, height } = this.parseConfiguration();
    this.setFFmpegCommands(aspectRatio, width, height);
    this.setProgress();
    this.setFileConfig();
  }

  parseConfiguration = () => {
    const { configuration } = this;
    const { ASPECT_RATIO } = configuration;
    const { HEIGHT, WIDTH } = ASPECT_RATIO;
    return { aspectRatio: ASPECT_RATIO.value, height: HEIGHT.value, width: WIDTH.value };
  }

  setFFmpegCommands = (aspectRatio: number, height: number, width: number) => {
    const verifyAspectRatio = width / height;
    if (aspectRatio === verifyAspectRatio) {
      this.ffmpegCommands = `-vf scale=${width}:${height}`;
    } else {
      throw new Error('Invalid aspect ratio!');
    }
  }

  setFileConfig = () => {
    this.fileConfig = { types: [{ name: 'video', number: { min: 1, max: 1 } }], primaryType: 'video' };
  }

  setProgress = () => {
    this.progressBar.name = 'Changing Aspect Ratio ...';
    this.progressBar.color = '#3FBD71';
  }
}

export default AspectRatioFeature;

const AspectRatioUi = ({ parents }: { parents: Array<string> }) => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [currentAspectRatio, setAspectRatio] = useState(width / height);

  useEffect(() => {
    setAspectRatio(width / height);
  }, [width, height]);

  useEffect(() => {
    updateConfiguration({
      value: currentAspectRatio,
      WIDTH: { value: width },
      HEIGHT: { value: height },
    }, [...parents]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAspectRatio]);

  return (
    <div className="flex flex-col">
      <div className="dar-input-wrapper">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide  text-xs font-bold mb-2" htmlFor="dar-width">
              Width
            </label>
            <input className="appearance-none block w-full bg-gray-200  border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="dar-width" type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value, 10))} />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide  text-xs font-bold mb-2" htmlFor="dar-height">
              Height
            </label>
            <input className="appearance-none block w-full bg-gray-200  border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="dar-height" type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value, 10))} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center dar-display-wrapper">
        <p className="flex text-l text-white font-bold">Aspect Ratio</p>
        <p className="flex text-m">
          {currentAspectRatio}
        </p>
        <p className="flex text-m">
          {(() => {
            const fraction = new Fraction(width, height);
            return `${fraction.numerator}/${fraction.denominator}`;
          })()}

        </p>
      </div>
    </div>
  );
};

export { AspectRatioUi };
