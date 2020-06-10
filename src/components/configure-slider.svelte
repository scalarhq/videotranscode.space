<script>
import {
  config,
  sliderStore
} from "../store/stores.js";
import { onMount } from "svelte";

let configuration;
let min;
let max;

config.subscribe((value) => {
    configuration = value;
    let currentCodec = configuration.codec;
    min = currentCodec.compressionRange.min;
    max = currentCodec.compressionRange.max;
});

let slider;
let sliderValue = $sliderStore;

onMount(() => {
  slider = document.getElementById("slide");
});

sliderStore.subscribe((value) => {
  sliderValue = value;
});

</script>

<div class="configure-slider">
    <input type="range" min={min} max={max} bind:value={sliderValue} id="slide">
</div>
<div>
    Value {sliderValue};
</div>

