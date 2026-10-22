'use strict';

document.getElementById('options-page').addEventListener('click', (event) => {
    event.preventDefault();
    chrome.runtime.openOptionsPage();
});

// Debug line: version, platform and UI locale (runtime.getPlatformInfo().nacl_arch is deprecated).
const manifest = chrome.runtime.getManifest();
chrome.runtime.getPlatformInfo((info) => {
    document.getElementById('debug').innerText =
        `v${manifest.version} (${info.os} ${info.arch}) - ${chrome.i18n.getUILanguage()}`;
});
