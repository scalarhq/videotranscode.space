/* eslint-disable no-param-reassign */
import { observable, action, toJS } from 'mobx';
import features from '../features/features';
import AbstractStore from './store';

class CluiStore extends AbstractStore {
  // Observables
  @observable cluiPlaceholder: string = '';

  @observable inputMessage: string = '';

  @observable isSubmitted: boolean = false;

  @observable chosenFeatures: Array<keyof typeof features> = [];

  @observable configuration: { [name: string]: { value: any; [name: string]: any } } = {};

  @observable configurationJS = {};

  @observable ran: boolean = false;

  // Constructor
  constructor() {
    super();
    this.init();
  }

  // Init
  @action init = () => {
    this.cluiPlaceholder = 'Hi, I am a clui!';
    this.inputMessage = '';
    this.isSubmitted = false;
    this.chosenFeatures = [];
    this.configuration = {};
    this.configurationJS = {};
  };

  // Actions

  @action updateCluiPlaceholder(newPlaceholder: string) {
    this.cluiPlaceholder = newPlaceholder;
  }

  @action
  public setInputMessage = (value: string) => {
    this.inputMessage = value;
  };

  @action setSubmitStatus = (value: boolean) => {
    this.isSubmitted = value;
  };

  /**
   *  Updates the store of chosen features to make it easier to parse the configuration on submit
   * @param newChosenFeatures Array of chosen features in order set by workflow or feature wrapper
   */
  @action updateChosenFeatures = (newChosenFeatures: Array<string>) => {
    if (newChosenFeatures.length > 0) {
      console.table(newChosenFeatures, ['Chosen Features']);
      this.chosenFeatures = newChosenFeatures as Array<keyof typeof features>;
    }
  };

  /**
   * Recursively Finds Correct Config and Updates it with the value
   *
   * Example, User updates config of Compress-Transcode->Transcode->Format->Codec is AVI
   * This method will create {Transcode : {Format : {Codec : {chosenCodec : "AVI"}}}}
   *
   * @param newConfiguration Object of user set configurations
   * @param parents An Array of keys of parents, this will determine where the object is updated
   */
  @action updateConfiguration = (
    newConfiguration: { value: any; [name: string]: any },
    parents: Array<string>
  ) => {
    const { configuration } = this;
    function updateObject(object: any) {
      while (parents.length > 1) {
        const key = parents.shift() as string;
        if (!(key in object)) {
          object = Object.assign(object, { [key]: {} });
        }
        object = object[key];
      }
      const key = parents.shift() as string;
      if (key in object) {
        object[key] = Object.assign(object[key], newConfiguration);
      } else {
        object = Object.assign(object, { [key]: newConfiguration });
      }
    }
    updateObject(configuration);

    this.configuration = configuration;

    this.configurationJS = toJS(configuration);
    // console.table(this.configurationJS);
  };

  @action('Update Ran')
  updateRun = (value = true) => {
    this.ran = value;
  };
}

export default new CluiStore();
