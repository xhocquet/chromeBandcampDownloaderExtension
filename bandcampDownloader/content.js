chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  sendResponse({response: document.documentElement.innerHTML});
});
