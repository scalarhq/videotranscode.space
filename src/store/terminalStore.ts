import { observable, action, computed } from 'mobx';

class TerminalStore {
  @observable terminalEmulator: HTMLElement | null = null;

  @observable t1: any;

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
      console.info(terminalEmulator);
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
