'use strict';

/* global VIEW_IMAGE_DEFAULTS */

let options = { ...VIEW_IMAGE_DEFAULTS };

const save = () => chrome.storage.sync.set({ options });

// Text fields only matter when manual button text is enabled.
const updatePage = () => {
    const manual = document.getElementById('manually-set-button-text').checked;
    document.getElementById('manual-toggle').classList.toggle('disabled', !manual);
};

const show = () => {
    for (const [key, value] of Object.entries(options)) {
        const element = document.getElementById(key);
        if (!element) continue;
        if (typeof value === 'boolean') element.checked = value;
        else element.value = value;
    }
    updatePage();
};

chrome.storage.sync.get('options', (storage) => {
    options = { ...VIEW_IMAGE_DEFAULTS, ...storage.options };
    show();
});

document.addEventListener('change', (event) => {
    const { id, type, checked, value } = event.target;
    if (!(id in VIEW_IMAGE_DEFAULTS)) return;
    options[id] = type === 'checkbox' ? checked : value;
    save();
    updatePage();
});

document.getElementById('reset-options').addEventListener('click', () => {
    options = { ...VIEW_IMAGE_DEFAULTS };
    save();
    show();
});
