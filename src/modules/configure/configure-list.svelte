<script lang="ts">
  import { find } from "../store/configuration";
  import { configSetOption } from "../store/stores";

  export let title = "";
  export let items = [];
  export let current = {};
  export let type = "";
  export let handleClick = null;
</script>

<style>
  .options-list-wrapper h1 {
    color: #959cb4;
  }

  .options-list-wrapper {
    display: flex;
    flex: 2 0 50%;
    padding: 1rem;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .options-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .options-list-item-wrapper {
    flex: 1 1 30%;
    padding-left: 10%;
  }

  .options-list-item {
    flex: 0 0 auto;
    color: #959cb4;
    padding: 0.4rem;
    border-radius: 5px;
    width: 100%;
  }

  .options-list-item.active {
    flex: 0 0 auto;
    background-color: rgba(62, 187, 112, 0.25);
    border: 1px solid #47b372;
    color: #f7f7f7;
    width: 100%;
  }

  .options-list-item a {
    color: inherit;
    padding-left: 3%;
  }

  .options-list-item a:hover {
    cursor: pointer;
  }
</style>

<div class="options-list-wrapper">
  <h1>{title}</h1>
  <div class="options-list">
    {#each items as item}
      <div class="options-list-item-wrapper">
        <div
          class={item.name === current.name ? 'options-list-item active' : 'options-list-item'}>

          <a on:click={e => handleClick(e, type, item.name)}>{item.name}</a>
        </div>
      </div>
    {/each}

  </div>
</div>
