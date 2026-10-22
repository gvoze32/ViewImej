'use strict';

const REPO = 'https://github.com/gvoze32/ViewImej';
// package.json on main holds the released version (the build copies it into the manifest).
const LATEST_VERSION_URL = 'https://raw.githubusercontent.com/gvoze32/ViewImej/main/package.json';

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

// Numeric dotted-version comparison: >0 if a is newer than b.
const compareVersions = (a, b) => {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i] || 0) - (pb[i] || 0);
        if (diff) return diff;
    }
    return 0;
};

const status = document.getElementById('update-status');
const button = document.getElementById('check-updates');

button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = chrome.i18n.getMessage('checkingUpdates');
    try {
        const response = await fetch(LATEST_VERSION_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { version: latest } = await response.json();
        if (!/^\d+(\.\d+)*$/.test(latest)) throw new Error(`bad version ${latest}`);
        if (compareVersions(latest, manifest.version) > 0) {
            const link = document.createElement('a');
            link.href = `${REPO}/releases/latest`;
            link.target = '_blank';
            link.textContent = chrome.i18n.getMessage('updateAvailable', [latest]);
            status.replaceChildren(link);
        } else {
            status.textContent = chrome.i18n.getMessage('upToDate', [manifest.version]);
        }
    } catch (error) {
        status.textContent = chrome.i18n.getMessage('updateCheckFailed');
        console.warn('[ViewImej] update check failed', error);
    } finally {
        button.disabled = false;
    }
});
