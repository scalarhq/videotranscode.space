import { observable, action } from 'mobx';

class TerminalStore {
  @observable terminalEmulator: HTMLElement | null = null;

  @observable t1: any;

  @action('Terminal Text Mutator')
  updateTerminalText: ((message: string, noflag?: boolean) => void) | null = (
    message: string,
    noflag?: boolean
  ) => {
    if (message) {
      // terminalMessage = message;
      // eslint-disable-next-line no-console
      // console.log('HandleNewMessage', this.t1, message);
      this.t1.print(`${noflag ? '' : '$'} ${message}`);
      const { terminalEmulator } = this;
      if (terminalEmulator) {
        terminalEmulator.scrollTop = terminalEmulator.scrollHeight;
      }
    }
  };
}

export default TerminalStore;
