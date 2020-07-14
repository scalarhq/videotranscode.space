import { config, sliderStore } from '../store/stores';

import { ConfigurationType } from '../../src/types/formats';

type FullConfiguration = {
  configuration: ConfigurationType;
  min: number;
  max: number;
  sliderValue: number;
  compressionValue: number;
};

let configuration: ConfigurationType;
let min = 0;
let max = 0;
let sliderValue = 0;
let compressionValue = 0;
//@ts-ignore Values Added Later
const finalConfiguration: FullConfiguration = {};

const assignConfiguration = (
  configuration: ConfigurationType,
  min: number,
  max: number,
  sliderValue: number,
  compressionValue: number
) => {
  Object.assign(finalConfiguration, {
    configuration,
    min,
    max,
    sliderValue,
    compressionValue,
  });
};

/** Triggers whenever the codec or format is changed */
config.subscribe((value: any) => {
  configuration = value;
  let currentCodec = configuration.codec;
  min = currentCodec.compressionRange.min;
  max = currentCodec.compressionRange.max;

  if (sliderValue > 0 && compressionValue > 0) {
    /** Updates the slider value to the range of the new codec in case the codec is switched */
    compressionValue = min + ((max - 1) * sliderValue) / 100;
  }

  console.log(
    `The new file format is ${configuration.format.name} and the chosen codec is ${configuration.codec.name}`
  );
  assignConfiguration(configuration, min, max, sliderValue, compressionValue);
});

/** Triggers whenever the slider is moved */
sliderStore.subscribe((value) => {
  sliderValue = value;
  console.log(`The new compression level is ${sliderValue}%`);
  /** Changes a 0-100 % range to a range between the minimum and maximum values for the chosen codec */
  compressionValue = min + ((max - 1) * sliderValue) / 100;
  assignConfiguration(configuration, min, max, sliderValue, compressionValue);
});

export { FullConfiguration, finalConfiguration };
