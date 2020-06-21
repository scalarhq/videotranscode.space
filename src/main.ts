import App from "./App.svelte";
import { terminalText } from "./store/stores";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;

// define a new console
let newConsole = function (oldCons: typeof window.console) {
  return {
    ...oldCons,
    log: function (text: string) {
      oldCons.log(text);
      terminalText.update(() => text);
    },
    info: function (text: string) {
      oldCons.info(text);
      // terminalText.update((existing) => text);
    },
    warn: function (text: string) {
      oldCons.warn(text);
      // Your code
    },
    error: function (text: string) {
      oldCons.error(text);
      // Your code
    },
  };
};

window.console = newConsole(window.console);
