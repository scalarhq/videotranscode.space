import { observable, action } from 'mobx';

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
  sendHardwareData = () => {
    if (this.data) {
      // const data = { ...this.data, 'form-name': 'data' };
      // const rawData = new URLSearchParams(
      //   Object.keys(data).map((key: string) => [
      //     key,
      //     // @ts-ignore Tester won't be here unless defined
      //     data[key as keyof FormData].toString(),
      //   ])
      // );
      // console.info(rawData.toString());
      // const request = new XMLHttpRequest();
      // request.open('POST', '/');
      // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // request.send(rawData.toString());
    }
  };
}

export default new HardwareStore();
