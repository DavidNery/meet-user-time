import { run, stop } from './recordTime';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'start') {
    const participants = document.body.querySelector('[jscontroller="gJYtNe"]');
    if (participants) {
      sendResponse(true);
      run(participants);
    } else {
      sendResponse(false);
    }
  } else if (request.action === 'stop') {
    sendResponse(stop());
  }
});