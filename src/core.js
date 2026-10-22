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
    const GOOGLE_HOST = /(^|\.)google\.[a-z.]+$|(^|\.)gstatic\.com$|(^|\.)googleusercontent\.com$/;
    // Thumbnail id -> original image URL entry in Google's inline JSON (raw or JS-string escaped):
    //   [0,"<id>",["<thumbnail>",h,w],["<original>",h,w]
    const DATA_ENTRY = /\[0,\\*"([\w-]{6,})\\*",\[\\*"[^"]*",\d+,\d+\],\[\\*"(https?:[^"]*?)\\*",\d+,\d+\]/g;
    const MIN_PREVIEW_SIZE = 120;

    const originals = new Map();
    const scannedScripts = new WeakSet();
    let options = null;
    let scheduled = false;

    const log = (...args) => {
        if (options && options.debug) console.log('[ViewImage]', ...args);
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

    const imgurlFromHref = (href) => {
        try {
            const url = new URL(href, location.href).searchParams.get('imgurl');
            return isOriginalUrl(url) ? url : null;
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

    const isExternalLink = (a) => {
        try {
            const url = new URL(a.href);
            return /^https?:$/.test(url.protocol) && !GOOGLE_HOST.test(url.hostname);
        } catch {
            return false;
        }
    };

    // The source-page button of a preview: an external link with an icon, a label and no image.
    const isVisitButton = (a) =>
        isExternalLink(a) && !a.querySelector('img') && a.querySelector('svg') !== null &&
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

    const buttonsFor = (imageUrl) => {
        const wanted = [{ role: 'view', text: options.viewImageText, href: imageUrl }];
        if (options.showSearchByImage) {
            wanted.push({
                role: 'search',
                text: options.searchByImageText,
                href: `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`,
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
        const row = ensureRow(preview.visit);
        keep.add(row);
        buttonsFor(imageUrl).forEach((want, index) => {
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
        viewImageText: String(raw.viewImageText || 'View image').trim(),
        searchByImageText: String(raw.searchByImageText || 'Search by image').trim(),
    });

    // options: { openInNewTab, noReferrer, showSearchByImage, viewImageText, searchByImageText, debug }
    const start = (initialOptions) => {
        // Extension and userscript share the DOM; a second instance would fight over the buttons.
        if (document.documentElement.hasAttribute(`${MARK}-active`)) {
            console.warn('[ViewImage] another View Image instance (extension or userscript) is already active; disable one of them.');
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
