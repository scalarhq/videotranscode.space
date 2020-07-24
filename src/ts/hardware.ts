import platform from 'platform';
// import { hardwareData } from '../store/stores';
import { FileDataType, HardwareDataType } from '../types/hardwareData';
import { FinalSettingsType } from '../types/formats';

const getThreads = () => {
  const threads = window.navigator.hardwareConcurrency;
  return threads < 8 ? threads : 8;
};

const sizeHumanReadable = (inputSize: number) => {
  let fileSize = inputSize;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;
  while (fileSize > 900) {
    fileSize /= 1024;
    i += 1;
  }
  const exactSize = `${Math.round(fileSize * 100) / 100} ${fSExt[i]}`;
  return exactSize;
};

const getBrowser = () => `${platform.name}:${platform.version} `;
const getOs = () => (platform.os ? platform.os.toString() : 'Not Found');
const getNavigator = () => platform.description;

const updateData = (
  encodeTime: number,
  fileData: FileDataType,
  finalSettings: FinalSettingsType
) => {
  const testerDom = document.getElementById('tester') as HTMLInputElement;
  console.info(testerDom);
  let tester = '';
  if (testerDom.value) {
    tester = `This is from an automated puppeteer tester, please check git actions for more details. Video duration ${testerDom.value}`;
    console.info(tester);
  }

  /** Gets data parameters */
  const threadsData = getThreads();
  const os = getOs();
  const navigator = getNavigator();
  const browserData = getBrowser();
  const inputFileSizeData = sizeHumanReadable(fileData.size);
  const encodeTimeData = encodeTime;

  const currentData: HardwareDataType = {
    inputFileSize: inputFileSizeData,
    encodeTime: encodeTimeData,
    threads: threadsData,
    inputFileFormat: fileData.ext,
    outputFileFormat: finalSettings.format,
    outputFileCodec: finalSettings.codec,
    browser: browserData,
    os,
    navigator: navigator || 'Not Found',
  };
  if (tester) {
    currentData.tester = tester;
  }
  // hardwareData.update((exisiting) => currentData);
};

export { updateData, getThreads };
