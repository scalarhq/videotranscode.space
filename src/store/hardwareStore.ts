import { observable, action } from 'mobx';

import { HardwareDataType } from '../types/hardwareData';

type FormData = HardwareDataType & { 'form-name': string };

class HardwareStore {
  // @ts-ignore Set in setting function
  @observable data: HardwareDataType;

  @action('Update Hardware Data')
  updateHardwareData = (newData: HardwareDataType) => {
    this.data = newData;
  };

  @action('Send Data')
  sendHardwareData = () => {
    if (this.data) {
      const data = { ...this.data, 'form-name': 'data' };

      const rawData = new URLSearchParams(
        Object.keys(data).map((key: string) => [
          key,
          // @ts-ignore Tester won't be here unless defined
          data[key as keyof FormData].toString(),
        ])
      );
      console.info(rawData.toString());

      const request = new XMLHttpRequest();
      request.open('POST', '/');
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      request.send(rawData.toString());
    }
  };
}

export default new HardwareStore();
