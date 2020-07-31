import { observable, action } from 'mobx';

class VideoStore {
  @observable url: string = '';

  @action
  updateBlobUrl = (newUrl: string) => {
    this.url = newUrl;
  };

  @observable toDisplay: boolean = false;

  @action
  updateVideoDisplay = (value: boolean) => {
    this.toDisplay = value;
  };

  @observable blobType: string = 'video/mp4';

  @action
  updateBlobType = (value: string) => {
    this.blobType = value;
  };
}

export default VideoStore;
