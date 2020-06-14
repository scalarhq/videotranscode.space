<script>
import { hardwareData } from "../store/stores.js"
import { onMount } from "svelte"

let form;
let threads;
let browser;
let inputFileSize;
let encodeTime;

onMount(() => {
    form = document.getElementById("data");
    threads = document.getElementById("threads");
    browser = document.getElementById("browser");
    inputFileSize = document.getElementById("inputFileSize");
    encodeTime = document.getElementById("encodeTime");
})

let data;
hardwareData.subscribe((value) => {
    data = value;
    if (threads) {
        threads = data.threads;
    }
    if (browser) {
        browser = data.browser;
    }
    if (inputFileSize) {
        inputFileSize = data.inputFileSize;
    }
    if (encodeTime) {
        encodeTime = data.encodeTime;
    }
    console.info(form);
    console.info(data);

    if (form && data) {
        data["form-name"] = "data";
        fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data)
      })
    }

});
</script>

<form name ="data" id="data" method="POST" data-netlify="true">
    <input type="hidden" name="threads" id="threads"/>
    <input type="hidden" name="browser" id="browser"/>
    <input type="hidden" name="inputFileSize" id="inputFileSize"/>
    <input type="hidden" name="encodeTime" id="encodeTime"/>
</form>