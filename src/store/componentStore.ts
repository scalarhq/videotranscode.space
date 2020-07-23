/* eslint-disable import/extensions */
import { observable, action } from 'mobx';

import CluiStore from './cluiStore';

import TerminalStore from './terminalStore';

// import { FORMAT_TYPES, CODEC_TYPES, ConfigOptions } from './configuration';
import { HardwareDataType } from '../types/hardwareData';
// import { ComponentStoreType } from "../types/store"

class ComponentStore {
  @observable CluiStore = new CluiStore();

  @observable terminalStore = new TerminalStore();

  @observable loaded = false;

  @observable transcoded = '';

  @observable videoDisplay = false;

  @observable submit = false;

  @observable showConfig = false;

  @observable processed = false;

  @observable fileUploaded: File[] = [];

  @observable progressStore = 1;

  @observable progressType: 'Transcode' | 'Compress' = 'Transcode';

  @observable sliderStore = 0;

  @observable hardwareData: HardwareDataType | null = null;

  @action('Update Loaded')
  updateLoaded = (value: boolean) => {
    this.loaded = value;
  };

  @action('Update Files')
  updateFiles = (value: File[]) => {
    this.fileUploaded = value;
    if (this.terminalStore) {
      // @ts-ignore
      this.terminalStore.updateTerminalText(`Received File ${value[0].name}`);
      // @ts-ignore
      this.terminalStore.updateTerminalText(
        'This is a CLUI, a Command Line Graphical Interface, it will help you choose you settings.',
        true
      );
    }
  };

  // @observable config = {
  //   /**
  //    * The format for FFmpeg to convert to
  //    */

  //   format: FORMAT_TYPES.MP4,
  //   /**
  //    * The video codec used for compression
  //    */

  //   codec: CODEC_TYPES.H264,

  //   /**
  //    * The amount of compression to apply. The range of acceptable values is based
  //    * on the codec.
  //    *
  //    */
  //   compressionLevel: 0,
  // };
  // @computed set configSetOption(data: { type: ConfigOptions; val: any }) {
  //   const { type, val } = data;
  //   const temp: any = {};
  //   /**
  //    * Error Caught Here, Expected
  //    * type ConfigurationType = {
  //    * format : FormatType,
  //    * codec: CodecType
  //    * }
  //    * Enum has Codec and Format, Mis Matched Case
  //    */

  //   temp[ConfigOptions[type].toLowerCase()] = val;
  //   const newObject = Object.assign({}, this.config, temp);
  //   this.config = newObject;
  // }
}
// @ts-ignore
// eslint-disable-next-line no-undef,  no-multi-assign
const store = (window.store = new ComponentStore());

export default store;
