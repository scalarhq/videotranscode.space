<script>
import {
  config
} from "../store/stores.js";
import { onMount } from "svelte"

let sliderMin = 0; 
let sliderMax = 100
let sliderValue = sliderMin;

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

let slider;

onMount(() => {
  slider = document.getElementById("slider");
});

let updateValue = () => {
  console.info("It works!");
  if (slider) {
    slider.addEventListener("mouseup", () => {
        console.log(slider.value);
      })
  }
}

</script>

<div class="configure-slider">
    <input type="range" min={sliderMin} max={sliderMax} bind:value={sliderValue} id="slider" on:click{() => updateValue()}>
</div>
<div>
  <div>
      Compression Level: {sliderValue}%;
  </div>
</div>

