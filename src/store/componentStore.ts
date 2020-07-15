import { observable, action } from 'mobx';

// import { FORMAT_TYPES, CODEC_TYPES, ConfigOptions } from './configuration';
import { HardwareDataType } from '../types/hardwareData';
// import { ComponentStoreType } from "../types/store"

class ComponentStore {
  @observable loaded = false;
  @observable transcoded = '';
  @observable terminalText = '';
  @observable clearTerminal = false;
  @observable videoDisplay = false;
  @observable submit = false;
  @observable showConfig = false;
  @observable processed = false;
  @observable fileUploaded: File[] = [];
  @observable progressStore = 1;
  @observable progressType: 'Transcode' | 'Compress' = 'Transcode';
  @observable sliderStore = 0;
  @observable hardwareData: HardwareDataType | null = null;
  @action("Update Loaded")
  updateLoaded = (value: boolean) => { this.loaded = value; };
  @action("Update Files")
  updateFiles = (value: File[]) => { this.fileUploaded = value; }
  @action("Update Terminal Text")
  updateTerminalText = (value: string) => { this.terminalText = value; }
  @action("Update Clear Terminal")
  updateClearTerminal = (value: boolean) => { this.clearTerminal = value; }

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
//@ts-ignore
var store = window.store = new ComponentStore();


export default store;
