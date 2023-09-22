chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const key = request.key || 'table';

  switch (request.action) {
    case 'saveTable':
      chrome.storage.local.set({ [key]: request.table }, () => {
        if (chrome.runtime.lastError) {
          sendResponse({ status: 'error', message: chrome.runtime.lastError });
        } else {
          sendResponse({ status: 'Table saved' });
        }
      });
      break;

    case 'getTable':
      chrome.storage.local.get([key], result => {
        if (chrome.runtime.lastError) {
          sendResponse({ status: 'error', message: chrome.runtime.lastError });
        } else {
          sendResponse({ table: result[key] });
        }
      });
      return true;

    case 'download':
      chrome.downloads.download({
        url: request.data,
        filename: 'horario.png'
      });
      break;

    default:
      sendResponse({ status: 'error', message: 'Invalid action' });
  }
});