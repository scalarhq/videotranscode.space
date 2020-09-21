import { observable, action } from 'mobx';

import axios from 'axios';
import { HardwareDataType } from '../types/hardwareData';
import AbstractStore from './store';

type FormData = HardwareDataType & { 'form-name': string };

class HardwareStore extends AbstractStore {
  // Observables

  // @ts-ignore Set in setting function
  @observable data: HardwareDataType = {};

  // Constructor
  constructor() {
    super();
    this.init();
  }

  @action init = () => {
    Object.assign(this.data, {});
  };

  @action('Update Hardware Data')
  updateHardwareData = (newData: HardwareDataType) => {
    this.data = newData;
  };

  @action('Send Data')
  sendHardwareData = async () => {
    const { data } = this;
    if (data) {
      await axios.post(
        atob(
          'aHR0cHM6Ly9ldXJvcGUtd2VzdDMtdW9mdC0yNTMzMTQuY2xvdWRmdW5jdGlvbnMubmV0L21vZGZ5LXNoZWV0cw=='
        ),
        {
          data,
        }
      );
    }
  };
}

export default new HardwareStore();
