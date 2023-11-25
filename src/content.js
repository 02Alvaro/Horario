if (window.name === 'main') {
  const storageKey = `table_${window.location.pathname}`;

  updateTable(storageKey);

  const contentActions = {
    edit: editTable,
    save: () => saveTable(storageKey),
    reset: resetTable,
    get: () => chrome.runtime.sendMessage({ action: 'getTable' }, updateTable(storageKey)),
    delete: () => {
      chrome.storage.local.clear();
      resetTable();
    },
    download: downloadTable,
    applyColors: applyColors,
    deleteColors: deleteColors,
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    stopEditingTable();
    const action = contentActions[request.action];
    if (action) {
      (request.colors) ? action(request.colors) : action();
    } else {
      sendResponse({ status: 'error', message: 'Invalid action' });
    }

  });

}



