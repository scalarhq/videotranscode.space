import App from "./App.svelte";
import { terminalText } from "./stores";

const app = new App({
  target: document.body,
  props: {
    name: "world",
    loaded: false,
  },
});

export default app;

// define a new console
let newConsole = function (oldCons) {
  return {
    log: function (text) {
      oldCons.log(text);
      terminalText.update((existing) => text);
    },
    info: function (text) {
      oldCons.info(text);
      // terminalText.update((existing) => text);
    },
    warn: function (text) {
      oldCons.warn(text);
      // Your code
    },
    error: function (text) {
      oldCons.error(text);
      // Your code
    },
  };
};

window.console = newConsole(window.console);
