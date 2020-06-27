import platform from "platform";
import { hardwareData } from "../store/stores";
import { FileDataType, HardwareDataType } from "../types/hardwareData";
import { FinalSettingsType } from "../types/formats";

const getThreads = () => {
  let threads = window.navigator.hardwareConcurrency;
  return (threads = threads < 8 ? threads : 8);
};

const sizeHumanReadable = (fileSize: number) => {
  let fSExt = new Array("Bytes", "KB", "MB", "GB"),
    i = 0;
  while (fileSize > 900) {
    fileSize /= 1024;
    i++;
  }
  let exactSize = Math.round(fileSize * 100) / 100 + " " + fSExt[i];
  return exactSize;
};

const getBrowser = () => {
  return `${platform.name}:${platform.version} `;
};
const getOs = () => {
  return platform.os ? platform.os.toString() : "Not Found";
};
const getNavigator = () => {
  return platform.description;
};

const updateData = (
  encodeTime: number,
  fileData: FileDataType,
  finalSettings: FinalSettingsType
) => {
  /** Gets data parameters */
  let threadsData = getThreads();
  let os = getOs();
  let navigator = getNavigator();
  let browserData = getBrowser();
  let inputFileSizeData = sizeHumanReadable(fileData.size);
  let encodeTimeData = encodeTime;

  let currentData: HardwareDataType = {
    inputFileSize: inputFileSizeData,
    encodeTime: encodeTimeData,
    threads: threadsData,
    inputFileFormat: fileData.ext,
    outputFileFormat: finalSettings.format,
    outputFileCodec: finalSettings.codec,
    browser: browserData,
    os: os,
    navigator: navigator ? navigator : "Not Found",
  };
  hardwareData.update((exisiting) => currentData);
};

export { updateData, getThreads };
