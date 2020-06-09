<script>
import {
  config,
} from "../store/stores.js";

import {
    getFFmpegFlags
} from "../store/configuration";

let configuration;
let min;
let max;

config.subscribe((value) => {
    configuration = value;
    let currentCodec = configuration.codec;
    min = currentCodec.compressionRange.min;
    max = currentCodec.compressionRange.max;
});

</script>

<div class="configure-slider">
    <input type="range" min={min} max={max} value={min} class="slider" id="myRange">
</div>

