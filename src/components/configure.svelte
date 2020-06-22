<script lang="ts">
  import OptionsList from "./configure-list.svelte";
  import { configSetOption, config, submit, showConfig } from "../store/stores";
  import {
    find,
    FORMAT_TYPES,
    CODEC_TYPES,
    CONFIG_OPTION_TYPES
  } from "../store/configuration";
  import Slider from "./configure-slider.svelte";

  const formats = Object.keys(FORMAT_TYPES).map(key => FORMAT_TYPES[key]);
  const codecs = Object.keys(CODEC_TYPES).map(key => CODEC_TYPES[key]);

  let current = $config;

  config.subscribe(val => (current = val));

  const handleClick = (e, type, val) => {
    e.preventDefault();
    if (type === CONFIG_OPTION_TYPES.FORMAT) {
      const format = find(type, val);
      if (format !== config.format) {
        configSetOption(CONFIG_OPTION_TYPES.CODEC, format.codecs[0]);
      }
    }
    configSetOption(type, find(type, val));
  };
  const handleSubmit = () => {
    submit.update(existing => true);
    showConfig.update(existing => false);
  };
</script>

<style>
  .configure {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    width: 60vh;
    height: 100%;

    background: #272c31;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08);

    border: 1px solid #4a5063;
    border-radius: 5px;
  }

  row {
    display: flex;
    flex-direction: row;
    padding-top: 2%;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
  }

  h3.format {
    font-family: Ubuntu Mono;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    color: #959cb4;
  }

  h1.title {
    text-align: center;
    font-weight: 200;
    font-size: 28px;
    color: #959cb4;
  }
</style>

<div>

  <div class="configure">
    <row>
      <OptionsList
        {handleClick}
        type={CONFIG_OPTION_TYPES.FORMAT}
        title="Output Format"
        items={formats}
        current={current.format} />
    </row>
    <row>
      <OptionsList
        {handleClick}
        type={CONFIG_OPTION_TYPES.CODEC}
        title="Output Codec"
        items={current.format.codecs.filter(element => element.notSupported !== true)}
        current={current.codec} />
    </row>
    <row>
      <Slider />
    </row>
    <row>
      <button on:click|once={handleSubmit}>Submit</button>
    </row>
  </div>
</div>
