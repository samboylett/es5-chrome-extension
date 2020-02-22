import { tabUpdated } from './messages';

chrome.extension.onConnect.addListener(port => {
    if (port.name !== 'devtools') {
        return;
    }

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        port.postMessage({
            type: tabUpdated,
            data: {
                tabId,
                changeInfo,
            },
        });
    });
});
