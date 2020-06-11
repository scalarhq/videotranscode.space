<script>
import {
  config,
  sliderStore
} from "../store/stores.js";
import { onMount } from "svelte"

let sliderMin = 0; 
let sliderMax = 100

let configuration;
let min;
let max;

/** Gets the current minimum and maximum based on the chosen codec **/
config.subscribe((value) => {
  configuration = value;
  let currentCodec = configuration.codec;
  min = currentCodec.compressionRange.min;
  max = currentCodec.compressionRange.max;
});

let sliderValue = $sliderStore;
sliderStore.subscribe(value => {
  sliderValue = value;
});

/** Sets the slider store's value to the current value **/
let updateValue = () => {
  sliderStore.update((existing) => sliderValue);
}
</script>

<div class="configure-slider">
    <input type="range" min={sliderMin} max={sliderMax} bind:value={sliderValue} on:change={updateValue}>
</div>
<div>
  <div>
      Compression Level: {sliderValue}%;
  </div>
</div>

