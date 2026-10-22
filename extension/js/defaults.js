'use strict';

/* exported VIEW_IMAGE_DEFAULTS */
// Option defaults shared by the content script and the options page (keys match the options form ids).
const VIEW_IMAGE_DEFAULTS = Object.freeze({
    'open-in-new-tab': true,
    'no-referrer': true,
    'show-search-by-image': true,
    'thumbnail-fallback': true,
    'manually-set-button-text': false,
    'button-text-view-image': '',
    'button-text-view-thumbnail': '',
    'button-text-search-by-image': '',
});
