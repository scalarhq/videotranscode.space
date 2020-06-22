<script lang="ts">
  import { fileUploaded } from "../store/stores";
  import Container from "./container.svelte";
  import Dropzone from "svelte-dropzone";
  import { fly } from "svelte/transition";

  $: uploaded = null;

  const addedfile = file => {
    uploaded = true;
    fileUploaded.update(existing => [file]);
  };

  const drop = event => {
    uploaded = true;
  };

  const init = () => {
    const dropzone = document.getElementById("dropzone");
    dropzone.style.backgroundColor = "#272C31";
    dropzone.style.boxShadow = "inset 0 2px 4px 0 rgba(0, 0, 0, 0.08)";
    dropzone.style.borderLeftColor = "none";
    dropzone.style.borderRightColor = "none";
    dropzone.style.borderTopColor = "none";
    dropzone.style.borderBottomColor = "none";
    dropzone.style.border = "1px solid #4A5063";
  };
  //export const fileUploaded = writable(uploaded)
</script>

<Container title="">
  <Dropzone
    dropzoneClass="dropzone"
    hooveringClass="hooveringClass"
    id="dropzone"
    dropzoneEvents={{ addedfile, drop, init }}
    options={{ clickable: true, createImageThumbnails: true, init }}>
    <h4>Drop files here to process</h4>
  </Dropzone>
</Container>
