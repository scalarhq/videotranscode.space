<script>
import {
  config,
  sliderStore
} from "../store/stores.js";

let sliderMin = 0; 
let sliderMax = 100

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

