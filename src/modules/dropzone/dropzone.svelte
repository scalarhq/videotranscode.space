<script lang="ts">
  import { fileUploaded } from "../..//store/stores";
  //@ts-ignore: Used inside Html of Svelte
  import Container from "../../components/container.svelte";
  //@ts-ignore: Used inside Html of Svelte
  import Dropzone from "svelte-dropzone";
  //@ts-ignore:  Svelte Support for $ sign
  $: uploaded = null;
  //@ts-ignore: Used inside Html of Svelte
  const addedfile = file => {
    uploaded = true;
    fileUploaded.update(() => [file]);
  };
  //@ts-ignore: Used inside Html of Svelte
  const drop = () => {
    uploaded = true;
  };
  //@ts-ignore: Used inside Html of Svelte
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
