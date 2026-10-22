// Builds dist/chrome, dist/firefox (unpacked + .zip) and dist/viewimage.user.js from one source tree.
// Usage: node scripts/build.mjs
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const read = (path) => readFileSync(join(root, path), 'utf8');

const { version } = JSON.parse(read('package.json'));
const tlds = JSON.parse(read('scripts/tlds.json'));
const searchMatches = tlds.map((tld) => `*://*.google.${tld}/search*`);
const core = read('src/core.js');

const baseManifest = {
    manifest_version: 3,
    name: '__MSG_appName__',
    version,
    description: '__MSG_appDesc__',
    default_locale: 'en',
    icons: { 16: 'icon/16.png', 19: 'icon/19.png', 38: 'icon/38.png', 48: 'icon/48.png', 128: 'icon/128.png' },
    action: { default_icon: 'icon/48.png', default_popup: 'html/popup.html' },
    permissions: ['storage'],
    options_ui: { page: 'html/options.html' },
    content_scripts: [
        {
            matches: searchMatches,
            js: ['js/defaults.js', 'js/core.js', 'js/content-script.js'],
            run_at: 'document_idle',
        },
    ],
};

const targets = {
    chrome: baseManifest,
    firefox: {
        ...baseManifest,
        browser_specific_settings: {
            // data_collection_permissions (required by AMO) needs Firefox 140 / Firefox for Android 142.
            gecko: {
                id: 'view-image-revived@viewimej',
                strict_min_version: '140.0',
                data_collection_permissions: { required: ['none'] },
            },
            gecko_android: { strict_min_version: '142.0' },
        },
    },
};

rmSync(dist, { recursive: true, force: true });

for (const [target, manifest] of Object.entries(targets)) {
    const out = join(dist, target);
    cpSync(join(root, 'extension'), out, { recursive: true });
    writeFileSync(join(out, 'js/core.js'), core);
    writeFileSync(join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 4)}\n`);
    execFileSync('zip', ['-qr', join(dist, `view-image-${target}-${version}.zip`), '.'], { cwd: out });
}

// Userscript: button labels for every bundled locale, picked from navigator.language at runtime.
const labels = {};
for (const locale of readdirSync(join(root, 'extension/_locales'))) {
    const messages = JSON.parse(read(`extension/_locales/${locale}/messages.json`));
    labels[locale.replace('_', '-').toLowerCase()] = {
        view: messages.viewImage?.message,
        search: messages.searchImage?.message,
    };
}

const icon = readFileSync(join(root, 'extension/icon/48.png')).toString('base64');
const header = [
    '// ==UserScript==',
    '// @name            View Image',
    '// @namespace       viewimej',
    `// @version         ${version}`,
    '// @description     Re-implements the Google Images\' "View image" and "Search by image" buttons, linking the original image (not the gstatic thumbnail).',
    '// @author          Joshua B, ner00, ViewImej contributors',
    '// @license         MIT',
    `// @icon            data:image/png;base64,${icon}`,
    ...searchMatches.map((match) => `// @match           ${match}`),
    '// @grant           none',
    '// @run-at          document-end',
    '// @noframes',
    '// ==/UserScript==',
].join('\n');

const userscript = `${header}

/* ---- Settings: edit to taste (empty text = browser language) ---- */
const VIEW_IMAGE_SETTINGS = {
    openInNewTab: true,
    noReferrer: false,
    showSearchByImage: true,
    viewImageText: '',
    searchByImageText: '',
    debug: false,
};
/* ------------------------------------------------------------------ */

${core}
(() => {
    const labels = ${JSON.stringify(labels)};
    const language = (navigator.language || 'en').toLowerCase();
    const label = labels[language] || labels[language.split('-')[0]] || labels.en;
    ViewImageCore.start({
        ...VIEW_IMAGE_SETTINGS,
        viewImageText: VIEW_IMAGE_SETTINGS.viewImageText || label.view || labels.en.view,
        searchByImageText: VIEW_IMAGE_SETTINGS.searchByImageText || label.search || labels.en.search,
    });
})();
`;

mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'viewimage.user.js'), userscript);
console.log(`built v${version}: dist/chrome, dist/firefox, dist/viewimage.user.js`);
