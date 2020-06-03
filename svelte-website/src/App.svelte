<script>
	import { writable } from 'svelte/store'
	import { fileUploaded } from './stores.js'
	import HeaderContent from './components/header.svelte'
	import Dropzone  from './components/dropzone.svelte'
	import Loader from './components/loader.svelte'
	import { fly } from 'svelte/transition'
	
	const loadedStore = writable(false)
	let loaded = $loadedStore
	loadedStore.subscribe(val => loaded = val)
	setTimeout(() => { loaded = true }, 500)
	let fileState = $fileUploaded
	fileUploaded.subscribe(val => fileState = val)
</script>

<main>
	{#if loaded === false}
		<Loader />
	{:else}
		<HeaderContent />
		{#if !fileState}
		 	<div transition:fly="{{ y: 200, duration: 2000 }}">
				<Dropzone />
			</div>
		{:else}
			<div></div>
		{/if}
	{/if }
</main>	

<style>

	html,
	main {
		text-align: center;
		padding: 1em;
		max-width: 30.379vh;
		margin: 0 auto;
	    font-family: 'Ubuntu Mono', monospace;
		font-weight: 400;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>