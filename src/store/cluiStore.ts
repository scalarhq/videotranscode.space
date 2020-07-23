import { act } from '@testing-library/react';
import { observable, action } from 'mobx';
import features from '../features/features';

class CluiStore {
  @observable cluiPlaceholder: string = 'Hi, I am a clui!';

  @observable inputMessage: string = '';

  @action
  public setInputMessage = (value: string) => {
    this.inputMessage = value;
  };

  @observable chosenFeatures: Array<keyof typeof features> = [];

  @observable configuration: { [name: string]: {} } = {};

  @action updateCluiPlaceholder(newPlaceholder: string) {
    this.cluiPlaceholder = newPlaceholder;
  }

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
    newConfiguration: { value: string; [name: string]: any },
    parents: Array<string>
  ) => {
    let { configuration } = this;
    while (parents.length > 1) {
      const key = parents.shift() as string;
      if (!(key in configuration)) {
        configuration[key] = {};
      }
      configuration = configuration[key];
    }
    const key = parents.shift() as string;
    configuration[key] = Object.assign(newConfiguration, configuration[key]);
    this.configuration = configuration;
  };
}

export default CluiStore;
