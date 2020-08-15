import { observable, action } from 'mobx';

abstract class AbstractStore {
  @action public abstract init = () => {};

  @action public reset = () => {
    this.init();
  };
}

export default AbstractStore;
