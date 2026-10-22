'use strict';

/* global ViewImageCore, VIEW_IMAGE_DEFAULTS */

const toCoreOptions = (stored) => {
    const options = { ...VIEW_IMAGE_DEFAULTS, ...stored };
    const manual = options['manually-set-button-text'];
    return {
        openInNewTab: options['open-in-new-tab'],
        noReferrer: options['no-referrer'],
        showSearchByImage: options['show-search-by-image'],
        thumbnailFallback: options['thumbnail-fallback'],
        viewImageText: (manual && options['button-text-view-image']) || chrome.i18n.getMessage('viewImage'),
        viewThumbnailText: (manual && options['button-text-view-thumbnail']) || chrome.i18n.getMessage('viewThumbnail'),
        searchByImageText: (manual && options['button-text-search-by-image']) || chrome.i18n.getMessage('searchImage'),
    };
};

chrome.storage.sync.get('options', (storage) => {
    ViewImageCore.start(toCoreOptions(storage.options));
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.options) {
        ViewImageCore.setOptions(toCoreOptions(changes.options.newValue));
    }
});
