<script>
  import { writable } from "svelte/store";
  import { fileUploaded, terminalText, loadedStore } from "./stores.js";
  import HeaderContent from "./components/header.svelte";
  import Terminal from "./components/terminal.svelte";
  import Dropzone from "./components/dropzone.svelte";
  import Loader from "./components/loader.svelte";
  import { fly, slide } from "svelte/transition";

  let loaded = $loadedStore;

  loadedStore.subscribe(val => {
    loaded = val;
  });
  setTimeout(() => {
    loadedStore.update(existing => true);
  }, 500);
  let fileState = $fileUploaded;
  fileUploaded.subscribe(val => (fileState = val));
</script>

<style>
  html,
  main {
    flex: 0 0 100%;
    width: 100%;
    align-self: stretch;
    text-align: center;
    padding: 1em;
    max-width: 30.379vh;
    margin: 0 auto;
    font-family: "Ubuntu Mono", monospace;
    font-weight: 400;
  }
  .flex-wrapper {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
  }
  .dropzone-wrapper {
    width: 50%;
  }
  .terminal-wrapper {
    max-width: 50%;
    padding-left: 5%;
  }

  @media (min-width: 640px) {
    main {
      max-width: 150vh;
    }
  }
</style>

<main>
  {#if loaded === false}
    <Loader />
  {:else}
    <HeaderContent />
    <div class="flex-wrapper" transition:fly={{ y: 200, duration: 2000 }}>
      {#if !fileState}
        <div class="dropzone-wrapper" out:fly={{ y: 200, duration: 2000 }}>
          <Dropzone />
        </div>
      {:else}
        <div />
      {/if}
      <div class="terminal-wrapper">
        <Terminal />
      </div>

    </div>
  {/if}

</main>
