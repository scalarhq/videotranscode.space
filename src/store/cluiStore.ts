/* eslint-disable no-param-reassign */
import { observable, action } from 'mobx';
import features from '../features/features';

class CluiStore {
  @observable cluiPlaceholder: string = 'Hi, I am a clui!';

  @action updateCluiPlaceholder(newPlaceholder: string) {
    this.cluiPlaceholder = newPlaceholder;
  }

  @observable inputMessage: string = '';

  @action
  public setInputMessage = (value: string) => {
    this.inputMessage = value;
  };

  @observable isSubmitted: boolean = false;

  @action setSubmitStatus = (value: boolean) => {
    this.isSubmitted = value;
  };

  @observable chosenFeatures: Array<keyof typeof features> = [];

  @observable configuration: { [name: string]: {} } = {};

  @observable configurationString: string = '';

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

    console.log(JSON.stringify(configuration));

    // configuration[key] = newConfiguration;
    this.configuration = configuration;
    console.log('Updating Configuration', JSON.stringify(this.configuration));

    this.configurationString = JSON.stringify(configuration);
  };
}

export default CluiStore;
