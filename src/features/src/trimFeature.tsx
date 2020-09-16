import React, { useEffect, useState } from 'react';
import { RangeSlider } from 'reactrangeslider';
import { observer } from 'mobx-react';
import FFmpegFeature from '../FFmpegFeature';

import ComponentStore from '../../store/componentStore';

const { CluiStore, FileStore } = ComponentStore;

const { updateConfiguration } = CluiStore;

type TrimConfig = {
  'TRIM': { 'START': { value: number }, 'STOP': { value: number }, value: number },
  [name: string]: any
}

const secondsToTime = (secs: number) => {
  const hours = Math.floor(secs / (60 * 60));

  const divisorForMinutes = secs % (60 * 60);
  const minutes = Math.floor(divisorForMinutes / 60);

  const divisorForSeconds = divisorForMinutes % 60;
  const seconds = Math.ceil(divisorForSeconds);

  const obj = {
    hours,
    minutes,
    seconds,
  };
  return obj;
};

const hmsToTimeStamp = ({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) => `${hours}:${minutes}:${seconds}`;

class TrimFeature extends FFmpegFeature {
  configuration: TrimConfig

  constructor(configuration: TrimConfig) {
    super();
    this.configuration = configuration;
    const { start, stop } = this.parseConfiguration();
    this.setFFmpegCommands(start, stop);
    this.setProgress();
    this.setFileConfig();
  }

  parseConfiguration = () => {
    const { TRIM } = this.configuration;
    const { START, STOP } = TRIM;
    return { start: START.value, stop: STOP.value };
  }

  setProgress = () => {
    this.progressBar.name = 'Trimming ...';
    this.progressBar.color = '#3FBD71';
  }

  setFileConfig = () => {
    this.fileConfig = { types: [{ name: 'video', number: { min: 1, max: 1 } }], primaryType: 'video' };
  }

  setFFmpegCommands = (start: number, end: number) => {
    const startTime = hmsToTimeStamp(secondsToTime(start));
    const endTime = hmsToTimeStamp(secondsToTime(end));

    console.info('Setting Trim Command', `-ss ${startTime} -to ${endTime} -c copy`);

    this.ffmpegCommands = `-ss ${startTime} -to ${endTime} -c copy`;
  }
}

export default TrimFeature;

const TrimUi = ({ parents }: { parents: Array<string> }) => {
  const { files } = FileStore;

  const { video } = files;

  const [value, setValue] = useState({
    start: 0,
    end: 100,
  });

  const [end, setEnd] = useState(files.video
    ? Math.ceil(files.video[0].videoMetadata?.duration || 100) : 100);

  useEffect(() => {
    console.info('Updated Files in TRIM', video);
    if (video && video[0]) {
      setValue({ start: 0, end: Math.ceil(video[0].videoMetadata?.duration || 100) });
      setEnd(Math.ceil(video[0].videoMetadata?.duration || 100));
      console.info('Updated duration');
    }
  }, [video]);

  useEffect(() => {
    updateConfiguration({
      START: { value: value.start },
      STOP: { value: value.end },
      value: value.end - value.start,
    }, [...parents]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const styles = {

    slider: {
      height: '3rem',
    },
    trackStyle: {
      height: 5,
      border: '3px solid black',
      backgroundColor: '#6c63ff',
      top: 14,
    },
    highlightedTrackStyle: {
      height: 5,
      border: '3px solid #6c63ff',
      backgroundColor: '#6c63ff',
      top: 14,
    },
    handleStyle: {
      height: 30,
      width: 30,
      border: '3px solid black',
      backgroundColor: '#3FBD71',
    },
  };

  return (
    <div className="flex flex-col">
      <p className="text-xl font-bold">Trim Settings</p>
      <div className="range-slider-wrapper flex w-full">
        <p className="text-m font-bold w-1/4">{(() => hmsToTimeStamp(secondsToTime(value.start)))()}</p>
        <div className="range-wrapper w-1/2">
          <RangeSlider
            value={value}
            step={1}
            min={0}
            max={end}
            onChange={(v: { start: number, end: number }) => {
              const deltaS = v.start - value.start;
              const deltaT = value.end - v.end;
              console.info('Changing ', v, 'deltaS', deltaS, 'deltaT', deltaT);
              if (Math.abs(deltaS) < 5 && Math.abs(deltaT) < 5) {
                setValue((oldValue) => ({ start: oldValue.start + deltaS, end: oldValue.end - deltaT }));
              }
            }}
            afterChange={(v: { start: number, end: number }) => { console.info('Completed Change', v); }}
            wrapperStyle={styles.slider}
            trackStyle={styles.trackStyle}
            highlightedTrackStyle={styles.highlightedTrackStyle}
            handleStyle={styles.handleStyle}
            hoveredHandleStyle={styles.handleStyle}
            focusedHandleStyle={styles.handleStyle}
            activeHandleStyle={styles.handleStyle}
          />
        </div>
        <p className="text-m font-bold w-1/4">{(() => hmsToTimeStamp(secondsToTime(value.end)))()}</p>
      </div>
    </div>
  );
};

const observerTrim = observer(TrimUi);

export { observerTrim as TrimUi };
