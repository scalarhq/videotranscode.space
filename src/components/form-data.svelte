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

    const length = Object.keys(data).length;

    if (form && length > 0) {
        console.log("Form and length > 0 TRIGGERED!")
        let formData = new FormData();
        formData.append("form-name", "data");
        formData.append("threads", threads);
        formData.append("browser", browser);
        formData.append("inputFileSize", inputFileSize);
        formData.append("encodeTime", encodeTime); 
        console.info(formData);

        let object = {};
        formData.forEach((value, key) => {object[key] = value});
        let json = JSON.stringify(object);
        console.info(json);

        const rawData = new URLSearchParams(Object.keys(data).map(key=>[key, data[key]]));
        console.info(rawData.toString());

        const request = new XMLHttpRequest();
        request.open("POST", "/");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(rawData);
    }

});
</script>

<form name ="data" id="data" method="POST" data-netlify="true">
    <input type="hidden" name="threads" id="threads"/>
    <input type="hidden" name="browser" id="browser"/>
    <input type="hidden" name="inputFileSize" id="inputFileSize"/>
    <input type="hidden" name="encodeTime" id="encodeTime"/>
</form>