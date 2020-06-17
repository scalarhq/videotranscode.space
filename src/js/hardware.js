export const getThreads = () => {
  let threads = window.navigator.hardwareConcurrency;
  return threads;
};

export const getBrowser = () => {
  let isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;
  if (isOpera) {
    return "Opera";
  }

  let isFirefox = typeof InstallTrigger !== "undefined";
  if (isFirefox) {
    return "Firefox";
  }

  let isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );
  if (isSafari) {
    return "Safari";
  }

  let isIE = /*@cc_on!@*/ false || !!document.documentMode;
  if (isIE) {
    return "Internet Explorer";
  }

  let isEdge = !isIE && !!window.StyleMedia;
  if (isEdge) {
    return "Edge";
  }

  let isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  if (isChrome) {
    return "Chrome";
  }
};
