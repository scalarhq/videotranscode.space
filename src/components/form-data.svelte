<script>
  import { hardwareData } from "../store/stores.js";
  import { onMount } from "svelte";

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
  });

  let data;
  hardwareData.subscribe(value => {
    data = value;
    if (threads) {
      threads.value = data.threads;
    }
    if (browser) {
      browser.value = data.browser;
    }
    if (inputFileSize) {
      inputFileSize.value = data.inputFileSize;
    }
    if (encodeTime) {
      encodeTime.value = data.encodeTime;
    }
    data["form-name"] = "data";

    const length = Object.keys(data).length;

    if (form && length > 0) {
      console.log("Form and length > 0 TRIGGERED!");
      // let formData = new FormData(document.getElementById("data"));
      // // formData.append("threads", threads.value);
      // // formData.append("browser", browser.value);
      // // formData.append("inputFileSize", inputFileSize.value);
      // // formData.append("encodeTime", encodeTime.value);
      // console.info(formData);

      // const formReq = new XMLHttpRequest();
      // formReq.open("POST", "/")
      // formReq.send(formData)

      // let object = {};
      // formData.forEach((value, key) => {object[key] = value});
      // let json = JSON.stringify(object);
      // console.info(json);

      const rawData = new URLSearchParams(
        Object.keys(data).map(key => [key, data[key]])
      );
      console.info(rawData.toString());

      const request = new XMLHttpRequest();
      request.open("POST", "/");
      request.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      request.send(rawData.toString());
    }
  });
</script>

<form name="data" id="data" method="POST" data-netlify="true" hidden>

  <input type="text" name="inputFileSize" id="inputFileSize" />
  <input type="text" name="browser" id="browser" />
  <input type="text" name="encodeTime" id="encodeTime" />
  <input type="number" name="threads" id="threads" />
</form>
