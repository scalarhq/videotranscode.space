import platform from "platform";

export const getThreads = () => {
  let threads = window.navigator.hardwareConcurrency;
  return threads;
};

export const sizeHumanReadable = (fileSize) => {
  let fSExt = new Array("Bytes", "KB", "MB", "GB"),
    i = 0;
  while (fileSize > 900) {
    fileSize /= 1024;
    i++;
  }
  let exactSize = Math.round(fileSize * 100) / 100 + " " + fSExt[i];
  return exactSize;
};

export const getBrowser = () => {
  return `${platform.name}:${platform.version} `;
};
export const getOs = () => {
  return platform.os;
};
export const getNavigator = () => {
  return platform.description;
};
