<script>
    import { find } from '../store/configuration.js'
    import { configSetOption } from '../store/stores'

    export let title = ''
    export let items = []
    export let current = {}
    export let type = ''
    export let handleClick = null

</script>

<style>
    .options-list h1 {
        color: #959CB4;
    }

    .options-list-wrapper {
        display: flex;
        flex: 1 0 50%;
        padding: 1rem;
        flex-wrap: wrap;
    }

    .options-list {
        display: flex;
        flex-direction: column;
    }

    .options-list-item-wrapper {
        flex: 1 1 30%;
    }

    .options-list-item {
        color: #5F6576;
        padding: 0.5rem;
        border-radius: 5px;
    }

    .options-list-item.active {
        background-color: rgba(0, 255, 101, .1);
    }

    .options-list-item a{
        color: inherit;
    }
</style>

<div class="options-list-wrapper">
    <div class="options-list">
            <h1>{title}</h1>
        
            {#each items as item}
                <div class="options-list-item-wrapper">
                    <div class="{item.name === current.name ? 'options-list-item active' : 'options-list-item'}">
                        
                            <a href="#" on:click={(e) => handleClick(e, type, item.name)}>{item.name}</a>
                    </div>
                </div>
            {/each}

    </div>
</div>