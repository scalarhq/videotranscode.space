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
    log: function (text: any) {
      oldCons.log(text);
      terminalText.update(() => text);
    },
    info: function (text: any) {
      oldCons.info(text);
      // terminalText.update((existing) => text);
    },
    warn: function (text: any) {
      oldCons.warn(text);
      // Your code
    },
    error: function (text: any) {
      oldCons.error(text);
      // Your code
    },
  };
};

window.console = newConsole(window.console);
