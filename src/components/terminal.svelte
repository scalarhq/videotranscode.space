<script>
  import { terminalText, loadedStore } from "../stores.js";
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
    t1.setBackgroundColor("#263238");
    t1.setTextColor("#76ff03");
    t1.setHeight("35vh");
    t1.blinkingCursor(true);
    t1.html.style.fontFamily = "Ubuntu Mono";
    t1.html.id = "terminalEmulator";
    t1.html.style.overflow = "auto";
    t1.html.style =
      "text-align: left; height: 35vh; font-family: Ubuntu Mono; overflow: auto; width : 60vh; display : flex; font-size: 20px; background-color : rgb(38, 50, 56, 0.8)";

    let terminalDiv = document.getElementById("terminal");
    terminalDiv.appendChild(t1.html);

    handleNewMessage("Hello, I am an Video Transcoder!", true);
    handleNewMessage(
      "But I am slightly different than other online video tools, I don't upload your files anywhere.",
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
</script>

<style>
  a :link {
    color: #ff3e00;
  }
</style>

<div id="terminal" />
