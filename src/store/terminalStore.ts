import { observable, action, computed } from 'mobx';
import AbstractStore from './store';

class TerminalStore extends AbstractStore {
  @observable terminalEmulator: HTMLElement | null = null;

  @observable t1: any;

  constructor() {
    super();
    this.init();
  }

  @action init = () => {
    this.terminalEmulator = null;
  };

  @action reset = () => {
    this.init();
    this.setDefaultTerminalText();
  };

  @action setDefaultTerminalText = () => {
    const { t1, updateTerminalText } = this;
    if (t1 && updateTerminalText) {
      t1.clear();
      updateTerminalText('Hello, I am a Video Transcoder!', true);
      updateTerminalText(
        "But I am slightly different than other online video tools, because I don't upload your files anywhere.",
        true
      );
      updateTerminalText(
        'Instead I protect your privacy by doing all the computation on your browser locally.',
        true
      );
      updateTerminalText(
        'I do this by using the amazing new technology called web assembly.',
        true
      );
      updateTerminalText('Loaded FFmpeg!');
    }
  };

  @computed get terminalIsDefined() {
    if (this.t1) {
      return true;
    }
    return false;
  }

  @action('Terminal Text Mutator')
  updateTerminalText: ((message: string, noflag?: boolean) => void) | null = (
    message: string,
    noflag?: boolean
  ) => {
    if (message && this.terminalIsDefined) {
      // terminalMessage = message;
      // eslint-disable-next-line no-console
      this.t1.print(`${noflag ? '' : '$'} ${message}`);
      const { terminalEmulator } = this;
      // console.info(terminalEmulator);
      if (terminalEmulator) {
        terminalEmulator.scrollTop = terminalEmulator.scrollHeight;
      }
    }
  };

  @action('Terminal Clear')
  clearTerminal = () => {
    if (this.terminalIsDefined) {
      this.t1.clear();
    }
  };
}

export default new TerminalStore();
