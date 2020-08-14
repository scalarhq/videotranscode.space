# The Feature Class

To start this process, we need to look at the FFmpegInterface. It is attached below but you can explore the entire interface {@link FFmpegInterface}

```ts
interface FFmpegInterface {
  configuration: {
    [name: string]: { value: any; [name: string]: any };
  };
  ffmpegCommands: string;
  threads: number;
  inputFileName: string;
  outputFileName: string;
  progressBar: { name: string; color: string };
  runFFmpeg: () => Promise<string>;
  getCurrentFileName: () => string;
  setFFmpegCommands: (...args: any[]) => void;
  parseConfiguration: () => { [name: string]: any };
  setProgress: () => void;
  updateProgress: () => void;
}
```

**You don't have to implement most of these functions**, they are already implemented for you at {@link FFmpegFeature}

The abstract elements you have to implement in your class are the following.

Of course, you have to implement **your own constructor** and call the **super constructor**

```ts
  configuration: {
    [name: string]: { value: any; [name: string]: any };
  };
  parseConfiguration: () => { [name: string]: any };
  setProgress: () => void;
  setFFmpegCommands: (...args: any[]) => void;
```

Let's talk about each of these abstract elements

## {@link FFmpegFeature.configuration}

This is an object literal which we want you to make in each feature class, this will take the values set by the User in your UI Components

An Example of this configuration would be, each feature must parse this configuration from the store to retrieve the values they want

```json
{
  "TRANSCODE": {
    "FORMAT": { "CODEC": { "name": "MPEG-4", "value": "MPEG-4" }, "name": "MOV", "value": "MOV" }
  },
  "COMPRESS": { "value": 34 }
}
```

For example in the compress feature we only care about the COMPRESS key so our object literal for configuration in the compress feature is of {@link CompressionConfig}

We just want this object literal to be made, **taken in as props for the constructor** and stored

## {@link FFmpegFeature.parseConfiguration}

This method is supposed to parse the required values in the configuration and return them to the constructor, the expectation is that these configuration values will be used to determine the ffmpegCommand

Example of a method is {@link TranscodeFeature.parseConfiguration}

## {@link FFmpegFeature.setProgress}

This method should mutate `this.progressBar` of the below type. This is just for the progress bar cosmetics

```ts
type progressBar = { name: string; color: string };
```

## {@link FFmpegFeature.setFFmpegCommands}

This method should mutate `this.ffmpegCommands` which is a string of extra ffmpegCommands, this is purely based on what the feature is trying to do

The expectation is that this command uses the users configuration to change the way it behaves.

For example, for compression the extra ffmpeg command is the following, where the value is read from the user.

```
-crf ${value}
```

These commands can get as complicated as you'd like them to as long as FFmpeg supports its.

**General linux commands are not supported**, don't try to add a pipe here.

## Constructor

Every feature class must have a constructor which accepts an object literal of type {@link FFmpegInterface.configuration}.

**The constructor must call the super constructor.**
