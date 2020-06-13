<script>
import { hardwareData } from "../store/stores.js"
import { onMount } from "svelte"

let threads;
let browser;
let inputFileSize;
let encodeTime;
onMount(() => {
    threads = document.getElementById("threads");
    browser = document.getElementById("browser");
    inputFileSize = document.getElementById("inputFileSize");
    encodeTime = document.getElementById("encodeTime");
})

let data;
hardwareData.subscribe((value) => {
    let data = value;
    if (threads) {
        threads = value.threads;
    }
    if (browser) {
        browser = value.browser;
    }
    if (inputFileSize) {
        inputFileSize = value.inputFileSize;
    }
    if (encodeTime) {
        encodeTime = value.encodeTime;
    }
})
</script>

<form name="data" method="POST" data-netlify="true">
    <input type="hidden" name="threads" id="threads"/>
    <input type="hidden" name="browser" id="browser"/>
    <input type="hidden" name="inputFileSize" id="inputFileSize"/>
    <input type="hidden" name="encodeTime" id="encodeTime"/>
</form>