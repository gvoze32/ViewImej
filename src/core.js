/*
 * View Image core: shared by the browser extension and the userscript.
 *
 * Google Images (2026 layout) renders the preview panel with a thumbnail from
 * encrypted-tbn*.gstatic.com and only swaps in the original when the origin
 * allows hotlinking. Reading <img>.src therefore often yields the thumbnail.
 * Instead, the original URL is resolved by the preview's thumbnail id (tbnid)
 * from data Google itself puts in the page:
 *   1. <link>/<a> elements with "/imgres?imgurl=<original>&tbnid=<id>"
 *   2. inline JSON entries: [0,"<id>",["<thumb>",h,w],["<original>",h,w]...]
 *   3. the preview <img> once it holds a non-thumbnail src
 * Class names are never relied on; Google rotates them constantly.
 */
'use strict';

/* exported ViewImageCore */
const ViewImageCore = (() => {
    const MARK = 'data-viewimage';
    const THUMB_HOST = /^https?:\/\/(?:encrypted-tbn\d*|t\d*)\.gstatic\.com\//;
    // Links that stay inside Google Search itself ("See more", related searches, redirects). Any other
    // page, including Google's own sites (Play, Blog, Arts & Culture, google.com/maps/about…), can be
    // the source of an image.
    const SEARCH_PATH = /^\/(?:search|url|imgres|goto|webhp)(?:[/?]|$)/;
    // Thumbnail id -> original image URL entry in Google's inline JSON (raw or JS-string escaped):
    //   [0,"<id>",["<thumbnail>",h,w],["<original>",h,w]
    const DATA_ENTRY = /\[0,\\*"([\w-]{6,})\\*",\[\\*"[^"]*",\d+,\d+\],\[\\*"(https?:[^"]*?)\\*",\d+,\d+\]/g;
    const MIN_PREVIEW_SIZE = 120;
    const PROBE_TIMEOUT_MS = 15000;

    const originals = new Map();
    const scannedScripts = new WeakSet();
    let options = null;
    let scheduled = false;

    const log = (...args) => {
        if (options && options.debug) console.log('[ViewImej]', ...args);
    };

    const isOriginalUrl = (url) =>
        typeof url === 'string' && /^https?:\/\//.test(url) && !THUMB_HOST.test(url);

    const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    };

    const isOwn = (node) => node.nodeType === 1 && (node.hasAttribute(MARK) || node.closest(`[${MARK}]`) !== null);

    // Undo JSON/JS string escaping (any depth) of a URL captured from page source.
    const unescapeUrl = (raw) => {
        let url = raw;
        for (let i = 0; i < 4 && url.includes('\\'); i++) {
            try {
                url = JSON.parse(`"${url}"`);
            } catch {
                break;
            }
        }
        return url;
    };

    const scanText = (text) => {
        if (!text || text.indexOf('[0,') === -1) return;
        for (const match of text.matchAll(DATA_ENTRY)) {
            const url = unescapeUrl(match[2]);
            if (isOriginalUrl(url)) originals.set(match[1], url);
        }
    };

    const scanScripts = () => {
        for (const script of document.scripts) {
            if (scannedScripts.has(script)) continue;
            scannedScripts.add(script);
            if (!script.src) scanText(script.textContent);
        }
    };

    // "x-raw-image:///<hash>" means Google has no URL for the image (it was embedded in the page);
    // it is passed on so the thumbnail fallback can kick in.
    const imgurlFromHref = (href) => {
        try {
            const url = new URL(href, location.href).searchParams.get('imgurl');
            return isOriginalUrl(url) || /^x-raw-image:/.test(url || '') ? url : null;
        } catch {
            return null;
        }
    };

    // Resolve the original image URL for a thumbnail id.
    const resolveOriginal = (tbnid, card) => {
        if (tbnid) {
            for (const el of document.querySelectorAll(`a[href*="tbnid=${tbnid}"], link[href*="tbnid=${tbnid}"]`)) {
                const url = imgurlFromHref(el.getAttribute('href'));
                if (url) {
                    originals.set(tbnid, url);
                    return url;
                }
            }
            if (originals.has(tbnid)) return originals.get(tbnid);
            // Legacy layout keeps the original on the result tile.
            const tile = document.querySelector(`[data-tbnid="${tbnid}"][data-ou]`);
            if (tile && isOriginalUrl(tile.getAttribute('data-ou'))) return tile.getAttribute('data-ou');
            scanScripts();
            if (originals.has(tbnid)) return originals.get(tbnid);
        }
        // Last resort: the preview image itself, only once it is no longer a thumbnail.
        let best = null;
        let bestArea = 0;
        for (const img of card.querySelectorAll('img')) {
            const rect = img.getBoundingClientRect();
            const area = rect.width * rect.height;
            if (area > bestArea && isOriginalUrl(img.currentSrc || img.src)) {
                best = img.currentSrc || img.src;
                bestArea = area;
            }
        }
        return best;
    };

    const ID_PATTERN = /^[\w-]{6,}$/;

    // Thumbnail ids of the currently opened preview, newest first.
    const activeIds = () => {
        const ids = [];
        const links = document.querySelectorAll('link[href*="imgurl="][href*="tbnid="]');
        for (let i = links.length - 1; i >= 0; i--) {
            ids.push(new URL(links[i].href, location.href).searchParams.get('tbnid'));
        }
        const hash = new URLSearchParams(location.hash.slice(1));
        // Legacy layout: #imgrc=<tbnid>
        ids.push(hash.get('imgrc'));
        // Current layout: #sv=<base64url protobuf> holding a length-prefixed "e-<tbnid>" string.
        const sv = hash.get('sv');
        if (sv) {
            try {
                const bytes = atob(sv.replace(/-/g, '+').replace(/_/g, '/'));
                const at = bytes.indexOf('e-');
                if (at > 0) ids.push(bytes.slice(at + 2, at + bytes.charCodeAt(at - 1)));
            } catch {
                // not base64; ignore
            }
        }
        return ids.filter((id) => id && ID_PATTERN.test(id));
    };

    const isSourceLink = (a) => {
        try {
            const url = new URL(a.href);
            if (!/^https?:$/.test(url.protocol)) return false;
            return !(url.hostname === location.hostname && SEARCH_PATH.test(url.pathname));
        } catch {
            return false;
        }
    };

    // The source-page button of a preview: a link out of Google Search with an icon, a label and no image.
    const isVisitButton = (a) =>
        isSourceLink(a) && !a.querySelector('img') && a.querySelector('svg') !== null &&
        a.textContent.trim().length > 0 && a.textContent.trim().length < 40 && !isOwn(a) && isVisible(a);

    const hasLargeImage = (el) => {
        for (const img of el.querySelectorAll('img')) {
            const rect = img.getBoundingClientRect();
            if (rect.width >= MIN_PREVIEW_SIZE && rect.height >= MIN_PREVIEW_SIZE) return true;
        }
        return false;
    };

    // Thumbnail ids referenced on or around a card: Google's jsdata ("model;<id>;slot") and data-tbnid.
    const cardIds = (card) => {
        const ids = new Set();
        const collect = (el) => {
            const tbnid = el.getAttribute('data-tbnid');
            if (tbnid) ids.add(tbnid);
            const jsdata = el.getAttribute('jsdata');
            if (!jsdata) return;
            for (const match of jsdata.matchAll(/(?:^|\s)\w+;([\w-]{6,});/g)) ids.add(match[1]);
        };
        for (let el = card; el && el !== document.body; el = el.parentElement) collect(el);
        for (const el of card.querySelectorAll('[jsdata], [data-tbnid]')) collect(el);
        return ids;
    };

    // Source page URL Google recorded for a thumbnail id (imgres "imgrefurl", legacy "data-ru").
    const sourcePage = (tbnid) => {
        for (const el of document.querySelectorAll(`a[href*="tbnid=${tbnid}"], link[href*="tbnid=${tbnid}"]`)) {
            try {
                const page = new URL(el.getAttribute('href'), location.href).searchParams.get('imgrefurl');
                if (page) return page;
            } catch {
                // malformed href; ignore
            }
        }
        const tile = document.querySelector(`[data-tbnid="${tbnid}"][data-ru]`);
        return tile ? tile.getAttribute('data-ru') : null;
    };

    // Which preview a Visit button belongs to: a thumbnail id referenced by its card, else the
    // active id whose recorded source page is exactly the page the Visit button links to.
    const previewId = (visit, ids, active) =>
        active.find((id) => ids.has(id)) ||
        active.find((id) => sourcePage(id) === visit.href) ||
        null;

    // Visible preview panels: { visit, card, tbnid }.
    const findPreviews = () => {
        const previews = [];
        const seen = new Set();
        const active = activeIds();
        for (const a of document.querySelectorAll('a[href]')) {
            if (!isVisitButton(a)) continue;
            let card = a.parentElement;
            for (let depth = 0; card && depth < 12 && !hasLargeImage(card); depth++) card = card.parentElement;
            if (!card || card === document.body || seen.has(card)) continue;
            seen.add(card);
            previews.push({ visit: a, card, tbnid: previewId(a, cardIds(card), active) });
        }
        return previews;
    };

    // Google delegates clicks/mousedowns from ancestors and document (rewriting links, opening the
    // source site via its /url redirect). Firefox even delivers middle-button "click" events only to
    // document/window. Stop such events at the window capture phase, before any page listener, when
    // they target our buttons; the default action (following href) is left untouched.
    const shieldOwnButtons = (event) => {
        const target = event.target;
        if (target && typeof target.closest === 'function' && target.closest(`a[${MARK}]`)) event.stopImmediatePropagation();
    };

    const makeButton = (visit, role, text, href) => {
        const button = visit.cloneNode(true);
        for (const el of [button, ...button.querySelectorAll('*')]) {
            for (const attr of ['id', 'ping', 'onclick', 'jsaction', 'jsname', 'jscontroller', 'data-ved', 'aria-hidden', 'aria-describedby', 'tabindex']) {
                el.removeAttribute(attr);
            }
        }
        // Drop icons (Visit chevron, globe) together with wrappers left empty by that.
        for (const svg of button.querySelectorAll('svg')) {
            let wrapper = svg.parentElement;
            svg.remove();
            while (wrapper && wrapper !== button && !wrapper.children.length && !wrapper.textContent.trim()) {
                const parent = wrapper.parentElement;
                wrapper.remove();
                wrapper = parent;
            }
        }
        for (const el of button.querySelectorAll('[aria-label]')) el.setAttribute('aria-label', text);

        // Put the label into the deepest element that carried the original text.
        const textHolders = [...button.querySelectorAll('*')].filter((el) => el.children.length === 0 && el.textContent.trim());
        if (textHolders.length) {
            textHolders[0].textContent = text;
            for (const extra of textHolders.slice(1)) extra.remove();
        } else {
            button.textContent = text;
        }

        button.setAttribute(MARK, role);
        button.setAttribute('title', text);
        button.href = href;
        if (options.openInNewTab) {
            button.target = '_blank';
        } else {
            button.removeAttribute('target');
        }
        button.rel = options.noReferrer ? 'noreferrer noopener' : 'noopener';
        if (options.noReferrer) button.referrerPolicy = 'no-referrer';
        return button;
    };

    // Google's own thumbnail of the open preview: the largest gstatic "/images?" picture in the card.
    const previewThumbnail = (card) => {
        let best = null;
        let bestArea = 0;
        for (const img of card.querySelectorAll('img')) {
            const src = img.currentSrc || img.src;
            const rect = img.getBoundingClientRect();
            if (THUMB_HOST.test(src) && /\/images\?/.test(src) && rect.width * rect.height > bestArea) {
                best = src;
                bestArea = rect.width * rect.height;
            }
        }
        return best;
    };

    // Whether an original really loads as an image, requested the way the button would open it (same
    // referrer policy). One check for every site: endpoints that redirect to an HTML page, 403/404,
    // expired signed links and hotlink blocks all fail to decode. Success is taken as soon as the
    // image's dimensions are known, without waiting for large files to finish. Plain-http originals
    // are not probed (an https page blocks or upgrades them, which would misreport them); a probe
    // that never settles counts as ok.
    // A failure is retried once: the browser may attach the first probe to Google's own in-flight
    // preview request for the same URL, which carries a google.com Referer and can be refused (403)
    // where our no-referrer request would succeed. A failed request is not reused, so the retry is
    // a request of its own.
    const PROBE_RETRY_MS = 500;
    const PROBE_POLL_MS = 100;
    const probes = new Map(); // `${referrerPolicy} ${url}` -> 'pending' | 'ok' | 'failed'

    const probeOriginal = (url) => {
        if (/^http:\/\//.test(url)) return 'ok';
        if (!/^https:\/\//.test(url)) return 'failed'; // e.g. x-raw-image:///<hash>: Google has no URL
        const policy = options.noReferrer ? 'no-referrer' : 'strict-origin-when-cross-origin';
        const key = `${policy} ${url}`;
        if (probes.has(key)) return probes.get(key);
        probes.set(key, 'pending');
        let img = null;
        let poll = 0;
        const settle = (state) => {
            clearInterval(poll);
            if (img) {
                img.onload = null;
                img.onerror = null;
                if (state === 'ok') img.src = ''; // stop downloading once we know it is an image
            }
            if (probes.get(key) !== 'pending') return;
            probes.set(key, state);
            log('probe', state, url);
            schedule();
        };
        const attempt = (retriesLeft) => {
            if (probes.get(key) !== 'pending') return;
            img = new Image();
            img.onload = () => settle(img.naturalWidth > 0 ? 'ok' : 'failed');
            img.onerror = () => {
                clearInterval(poll);
                if (retriesLeft > 0) setTimeout(() => attempt(retriesLeft - 1), PROBE_RETRY_MS);
                else settle('failed');
            };
            img.referrerPolicy = policy;
            img.src = url;
            poll = setInterval(() => {
                if (img.naturalWidth > 0) settle('ok');
            }, PROBE_POLL_MS);
        };
        setTimeout(() => settle('ok'), PROBE_TIMEOUT_MS);
        attempt(1);
        return 'pending';
    };

    // View image once the original is confirmed to load. If it fails, offer Google's thumbnail under
    // its own "View thumbnail" label, unless disabled; Search by image then also uses the thumbnail,
    // which Lens accepts. While the check runs, no buttons are shown, so nothing points at a URL that
    // turns out not to be an image.
    const buttonsFor = (imageUrl, card) => {
        const state = probeOriginal(imageUrl);
        if (state === 'pending') return [];
        const usable = state === 'ok';
        const thumbnail = usable ? null : previewThumbnail(card);
        const wanted = [];
        if (usable) {
            wanted.push({ role: 'view', text: options.viewImageText, href: imageUrl });
        } else if (options.thumbnailFallback && thumbnail) {
            wanted.push({ role: 'thumbnail', text: options.viewThumbnailText, href: thumbnail });
        }
        const searchSource = usable ? imageUrl : thumbnail;
        if (options.showSearchByImage && searchSource) {
            wanted.push({
                role: 'search',
                text: options.searchByImageText,
                href: `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(searchSource)}`,
            });
        }
        return wanted;
    };

    // Our buttons live in their own row right after Visit. In a flex header (title + Visit) the row
    // breaks onto its own line instead of squeezing the title to nothing.
    const ensureRow = (visit) => {
        let row = visit.nextElementSibling;
        if (!row || row.getAttribute(MARK) !== 'row') {
            row = document.createElement('div');
            row.setAttribute(MARK, 'row');
            row.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;flex-basis:100%;margin-top:8px';
            visit.after(row);
        }
        const parent = visit.parentElement;
        if (getComputedStyle(parent).display.includes('flex') && getComputedStyle(parent).flexWrap !== 'wrap') {
            parent.style.flexWrap = 'wrap';
        }
        return row;
    };

    // Ensure the buttons next to one preview's Visit button are present and current.
    const decorate = (preview, keep) => {
        const imageUrl = resolveOriginal(preview.tbnid, preview.card);
        if (!imageUrl) {
            log('original URL not resolved yet', preview.tbnid);
            return;
        }
        const wanted = buttonsFor(imageUrl, preview.card);
        if (!wanted.length) {
            log('no usable image for', imageUrl);
            return;
        }
        const row = ensureRow(preview.visit);
        keep.add(row);
        wanted.forEach((want, index) => {
            let button = row.children[index];
            const current = button && button.getAttribute(MARK) === want.role &&
                button.getAttribute('href') === want.href && button.textContent.trim() === want.text &&
                (button.target === '_blank') === Boolean(options.openInNewTab);
            if (!current) {
                const fresh = makeButton(preview.visit, want.role, want.text, want.href);
                if (button) button.replaceWith(fresh);
                else row.append(fresh);
                button = fresh;
                log('added', want.role, want.href);
            }
            keep.add(button);
        });
    };

    const update = () => {
        scheduled = false;
        const keep = new Set();
        for (const preview of findPreviews()) decorate(preview, keep);
        for (const stale of document.querySelectorAll(`[${MARK}]`)) {
            if (!keep.has(stale)) stale.remove();
        }
    };

    const schedule = () => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(update, 50);
    };

    // Our own insertions/removals and attribute writes must not retrigger work.
    const onMutations = (mutations) => {
        const relevant = mutations.some((mutation) => {
            if (isOwn(mutation.target)) return false;
            if (mutation.type !== 'childList') return true;
            return mutation.removedNodes.length > 0 ||
                [...mutation.addedNodes].some((node) => !(node.nodeType === 1 && node.hasAttribute(MARK)));
        });
        if (relevant) schedule();
    };

    const normalize = (raw) => ({
        ...raw,
        thumbnailFallback: raw.thumbnailFallback !== false,
        viewImageText: String(raw.viewImageText || 'View image').trim(),
        viewThumbnailText: String(raw.viewThumbnailText || 'View thumbnail').trim(),
        searchByImageText: String(raw.searchByImageText || 'Search by image').trim(),
    });

    // options: { openInNewTab, noReferrer, showSearchByImage, thumbnailFallback, viewImageText,
    //            viewThumbnailText, searchByImageText, debug }
    const start = (initialOptions) => {
        // Extension and userscript share the DOM; a second instance would fight over the buttons.
        if (document.documentElement.hasAttribute(`${MARK}-active`)) {
            console.warn('[ViewImej] another ViewImej / View Image instance (extension or userscript) is already active; disable one of them.');
            return;
        }
        document.documentElement.setAttribute(`${MARK}-active`, '');
        options = normalize(initialOptions);
        log('starting', options);
        new MutationObserver(onMutations).observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'href', 'aria-hidden', 'style'],
        });
        for (const type of ['click', 'auxclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'keydown', 'contextmenu']) {
            window.addEventListener(type, shieldOwnButtons, true);
        }
        window.addEventListener('hashchange', schedule);
        window.addEventListener('resize', schedule);
        schedule();
    };

    const setOptions = (nextOptions) => {
        if (!options) return; // start() declined (another instance is active)
        options = normalize(nextOptions);
        for (const button of document.querySelectorAll(`[${MARK}]`)) button.remove();
        schedule();
    };

    return { start, setOptions };
})();
