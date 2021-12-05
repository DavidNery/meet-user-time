const button = document.getElementsByTagName('button')[0];

const stop = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id || 0, { action: 'stop' }, response => {
      if (response) {
        chrome.storage.local.remove('running');
        button.onclick = start;
        button.innerHTML = 'Start';

        const blob = new Blob([JSON.stringify(response)], { type: 'text/plain' });
        chrome.downloads.download({
          saveAs: true,
          url: URL.createObjectURL(blob)
        });
      } else {
        alert('Não foi possível parar!');
      }
    });
  });
}

const start = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id || 0, { action: 'start' }, response => {
      if (response) {
        button.innerHTML = 'Stop';
        button.onclick = stop;
        chrome.storage.local.set({ running: true });
      } else {
        alert('Participant list not found');
      }
    });
  });
};

chrome.storage.local.get(['running'], result => {
  if (result.running) {
    button.onclick = stop;
    button.innerHTML = 'Stop';
  } else {
    button.onclick = start;
  }
});