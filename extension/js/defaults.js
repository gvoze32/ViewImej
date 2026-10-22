'use strict';

/* exported VIEW_IMAGE_DEFAULTS */
// Option defaults shared by the content script and the options page (keys match the options form ids).
const VIEW_IMAGE_DEFAULTS = Object.freeze({
    'open-in-new-tab': true,
    'no-referrer': false,
    'show-search-by-image': true,
    'manually-set-button-text': false,
    'button-text-view-image': '',
    'button-text-search-by-image': '',
});
