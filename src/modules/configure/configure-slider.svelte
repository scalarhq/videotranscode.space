<script lang="ts">
  import { config, sliderStore } from "../../store/stores";

  let sliderMin = 0;
  let sliderMax = 100;

  let sliderValue = $sliderStore;
  sliderStore.subscribe(value => {
    sliderValue = value;
  });

  /** Sets the slider store's value to the current value **/
  let updateValue = () => {
    sliderStore.update(existing => sliderValue);
  };
</script>

<style>
  .configure-slider {
    background: #30363b;
    border-radius: 5px;
  }
  .slider {
    -webkit-appearance: none;
    background: #272c31;
    border-radius: 100px;
    padding: 0em !important;
    border: 1px solid #2723c1 !important;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #3fbd71;
    cursor: pointer;
  }
</style>

<!-- 
<div class>
  <div class="configure-slider">
    <input type="range" min={sliderMin} max={sliderMax} bind:value={sliderValue} on:change={updateValue} class="slider">
  </div>
  <div>
      Compression Level: {sliderValue}%
  </div>
</div> -->
