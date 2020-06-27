import { hardwareData } from "../store/stores";
import { HardwareDataType } from "../types/hardwareData";

type FormData = HardwareDataType & { "form-name": string };

let data: FormData;
hardwareData.subscribe((value) => {
  if (value) {
    data = { ...value, "form-name": "data" };

    console.info("TRIGGERED!");

    const rawData = new URLSearchParams(
      Object.keys(data).map((key: string) => [
        key,
        data[key as keyof FormData].toString(),
      ])
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
