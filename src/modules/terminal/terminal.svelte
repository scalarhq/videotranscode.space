<script lang="ts">
  import { terminalText, loadedStore, clearTerminal } from "../store/stores";
  import { onMount } from "svelte";
  const t1 = new Terminal();
  const handleNewMessage = function(message, noflag) {
    if (message) {
      terminalMessage = message;
      t1.print(`${noflag ? "" : "$"} ${message}`);
      let terminalEmulator = document.getElementById("terminalEmulator");
      if (terminalEmulator) {
        terminalEmulator.scrollTop = terminalEmulator.scrollHeight;
      }
    }
  };
  const addSpecialMessage = function(message, noflag) {
    let terminalEmulator = document.getElementById("terminalEmulator");
    if (terminalEmulator) {
      let mainDiv = terminalEmulator.childNodes[0];
      let pTag = mainDiv.childNodes[0];
      let newDiv = document.createElement("div");
      newDiv.innerHTML = message;
      pTag.appendChild(newDiv);
    }
  };
  onMount(() => {
    t1.setBackgroundColor("#272C31");
    t1.setTextColor("#3FBD7");
    t1.blinkingCursor(true);
    t1.html.style.fontFamily = "Ubuntu Mono";
    t1.html.id = "terminalEmulator";
    t1.html.style.overflow = "auto";
    t1.html.style =
      "flex: 0 1 auto; border: 1px solid #4A5063; border-radius: 5px; height: 35vh; text-align: left; font-family: Ubuntu Mono; overflow: auto; width : 60vh; display : flex; font-size: 16px; background-color: #272C31; color: #3FBD71";

    let terminalDiv = document.getElementById("terminal");
    terminalDiv.appendChild(t1.html);
    t1.clear();
    handleNewMessage("Hello, I am a Video Transcoder!", true);
    handleNewMessage(
      "But I am slightly different than other online video tools, because I don't upload your files anywhere.",
      true
    );
    handleNewMessage(
      "Instead I protect your privacy by doing all the computation on your browser locally.",
      true
    );
    addSpecialMessage(
      `I do this by using the amazing new technology called <a style="color: #ff3e00" href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">web assembly</a>.`,
      true
    );
    let loaded = $loadedStore;

    loadedStore.subscribe(val => {
      loaded = val;
      if (loaded) {
        handleNewMessage("Loaded FFmpeg!");
      }
    });
  });
  let terminalMessage = $terminalText;

  terminalText.subscribe(value => handleNewMessage(value));
  clearTerminal.subscribe(value => {
    if (value) {
      t1.clear();
      clearTerminal.update(() => false);
    }
  });
</script>

<style>
  /* a :link {
    color: #ff3e00;
  } */
</style>

<div id="terminal" style="display: flex; flex: 0 1; height: 100%;" />
