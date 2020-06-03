<script>
    import { fileUploaded } from '../stores.js'
    import Container from './container.svelte'
    import Dropzone from 'svelte-dropzone'
    import { fly } from 'svelte/transition'
    
    $: uploaded = false
    
    const addedfile = file => {
      uploaded = true
      fileUploaded.update(existing => true)
    }
    
    const drop = event => { 
      uploaded = true 
      fileUploaded.update(existing => true)
    }

    const init = () => {
      const dropzone = document.getElementById('dropzone')
      dropzone.style.backgroundColor = '#272C31'
      dropzone.style.border = '0'
      dropzone.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.08)'
    }
    //export const fileUploaded = writable(uploaded)


</script>

<Container title=""> 
    <Dropzone 
    dropzoneClass="dropzone"
    hooveringClass="hooveringClass"
    id="dropzone" 
    dropzoneEvents={{ addedfile, drop, init }}
    options={{ clickable: true, createImageThumbnails : true, init }}>
    <h4>Drop files here to upload</h4>
    </Dropzone>
</Container>
