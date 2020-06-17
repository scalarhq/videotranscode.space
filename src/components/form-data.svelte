<script>
  import { hardwareData } from "../store/stores.js";

  let data;
  hardwareData.subscribe(value => {
    data = value;
    data["form-name"] = "data";

    const length = Object.keys(data).length;

    if (form && length > 0) {
      console.log("Form and length > 0 TRIGGERED!");

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

<div />
