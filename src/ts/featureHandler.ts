import { FFmpegInterface } from '../features/FFmpegFeature';

interface Feature {
  [name: string]: { new (): FFmpegInterface };
}

const executeFeature = async (key: string, features: Feature, featureArgs: any[]) => {
  const CurrentFeature = features[key];
  // @ts-ignore This is a child of FFmpegFeature and thus takes argument
  const featureObject = new CurrentFeature(...featureArgs);

  const { ffmpegCommands } = featureObject;

  if (ffmpegCommands) {
    const processedFile = await featureObject.runFFmpeg();
    return processedFile;
  }
  return new Error('FFmpeg Commands not found');
};

export default executeFeature;
