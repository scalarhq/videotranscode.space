<script>
    export let type = {}
    export let value = 1
    let min = type.compressionRange.min
    let max = type.compressionRange.max
</script>

<div class="configure-slider">
    <input type="range" min={min} max={max} bind:value={value}>
</div>

