<script>
  import { writable } from "svelte/store";
  import {
    fileUploaded,
    terminalText,
    loadedStore,
    videoDisplay,
    processed,
    showConfig,
    progressStore
  } from "./store/stores.js";
  import "./js/ffmpeg.js";
  import HeaderContent from "./components/header.svelte";
  import Terminal from "./components/terminal.svelte";
  import Dropzone from "./components/dropzone.svelte";
  import Loader from "./components/loader.svelte";
  import { fly, slide } from "svelte/transition";
  import Configure from "./components/configure.svelte";
  import Video from "./components/video.svelte";
  import Progress from "./components/progress.svelte";
  import Footer from "./components/footer.svelte";
  import Form from "./components/form-data.svelte"

  let loaded = $loadedStore;

  loadedStore.subscribe(val => {
    loaded = val;
  });
  let fileState = $fileUploaded;
  fileUploaded.subscribe(val => (fileState = val));
  let processedState = $processed;

  let progressState = $progressStore;
  progressStore.subscribe(val => {
    progressState = val > 0 ? true : false;
    if (progressState) {
      progressState = val == 100 ? false : true;
    }
  });
  processed.subscribe(val => (processedState = val));

  let configState = $showConfig;
  showConfig.subscribe(val => (configState = val));

  export let notSupported = false;

  if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    loadedStore.update(existing => true);
    notSupported = true;
  }
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

  .col {
    flex: 1 0;
    flex-direction: column;
    box-sizing: border-box;
    padding: 1rem;
  }

  .dropzone-wrapper {
    width: 50%;
  }
  .video-wrapper {
    width: 50%;
  }

  .terminal-wrapper {
    max-width: 50%;
    padding-left: 5%;
    height: 100%;
  }

  .configure-wrapper {
    width: 50%;
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
  {:else if notSupported}
    <h1>Sorry, this browser is not supported at this time</h1>
  {:else}
    <HeaderContent />
    <div class="flex-wrapper" transition:fly={{ y: 200, duration: 2000 }}>
      {#if !fileState}
        <div class="col dropzone-wrapper" out:fly={{ y: 200, duration: 2000 }}>
          <Dropzone />
        </div>
      {:else if configState}
        <div
          class="configure-wrapper"
          in:fly={{ delay: 500, y: 200, duration: 2000 }}
          out:fly={{ y: 200, duration: 2000 }}>
          <Configure />
        </div>
      {:else if progressState}
        <div
          in:fly={{ delay: 1500, y: 200, duration: 2000 }}
          out:fly={{ y: 200, duration: 2000 }}>
          <Progress />
        </div>
      {:else if processedState}
        <div
          class="col video-wrapper"
          transition:fly={{ delay: 2000, y: 200, duration: 2000 }}>
          <Video />
        </div>
      {:else}
        <div />
      {/if}
     
      <div class="terminal-wrapper">
        <Terminal />
      </div>
    </div>
  {/if}
   <Form />
  <Footer />
</main>
