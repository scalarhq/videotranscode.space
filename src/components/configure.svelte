<script>
  import OptionsList from './configure-list.svelte'
  import { config } from '../store/stores'
  import { find, FORMAT_TYPES, CODEC_TYPES, CONFIG_OPTION_TYPES } from '../store/configuration'

  const formats = Object.keys(FORMAT_TYPES).map(key => FORMAT_TYPES[key])
  const codecs = Object.keys(CODEC_TYPES).map(key => CODEC_TYPES[key])

  let current = $config

  config.subscribe(val => (current = val))

  const configSetOption = (type, val) => {
    if (!Object.values(CONFIG_OPTION_TYPES).includes(type)) return

    const temp = {}
    temp[type] = val
    config.update(state => Object.assign({}, state, temp))
  }

  const handleClick = (e, type, val) => {
    e.preventDefault()
    configSetOption(type, find(type, val))
  }
</script>

<style>
  .configure {
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    width: 600px;
    height: 260px;
    left: 330px;
    top: 300px;

    background: #272c31;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08);

    border: 1px solid #4A5063;
    border-radius: 5px;
  }

  h3.format {
    font-family: Ubuntu Mono;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    color: #959cb4;
  }

  h1.title {
    text-align: left;
    font-weight: 200;
    font-size: 28px;
    color: #959CB4;
  }
</style>

<div>
  <h1 class="title">Configure</h1>
  <div class="configure">
    <OptionsList handleClick={handleClick} type={CONFIG_OPTION_TYPES.FORMAT} title='Format' items={formats} current={current.format}/>
    <OptionsList handleClick={handleClick} type={CONFIG_OPTION_TYPES.CODEC} title='Codec' items={codecs} current={current.codec} />
  </div>
</div>
