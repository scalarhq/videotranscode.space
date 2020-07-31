import { observable, action } from 'mobx';

class ProgressStore {
  @observable progress: number = 1;

  @observable color: string = '';

  @observable name: string = '';

  @action
  updateStatic = (newName: string, newColor: string) => {
    this.name = newName;
    this.color = newColor;
  };

  @action
  updateProgress = (value: number) => {
    this.progress = value;
  };
}

export default ProgressStore;
