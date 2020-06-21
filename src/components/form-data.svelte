<script lang="ts">
  import { hardwareData } from "../store/stores";

  let data;
  hardwareData.subscribe(value => {
    data = value;
    data["form-name"] = "data";

    const length = Object.keys(data).length;

    if (length > 1) {
      console.info("TRIGGERED!");

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
