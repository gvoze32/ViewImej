// ==UserScript==
// @name            ViewImej
// @namespace       https://github.com/gvoze32/ViewImej
// @version         6.2.1
// @description     Re-implements the Google Images' "View image" and "Search by image" buttons, linking the original image (not the gstatic thumbnail).
// @author          gvoze32 (ViewImej); based on View Image by Joshua B and ner00
// @homepageURL     https://github.com/gvoze32/ViewImej
// @supportURL      https://github.com/gvoze32/ViewImej/issues
// @updateURL       https://raw.githubusercontent.com/gvoze32/ViewImej/main/userscript/viewimej.user.js
// @downloadURL     https://raw.githubusercontent.com/gvoze32/ViewImej/main/userscript/viewimej.user.js
// @license         MIT
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABQpJREFUeNrsmEtsG0UYgH+7cRSahFoKaapQpeGAAqpo94AQSDyc0MCBA0Fw4mRD2kOV0JgcqJRDOZZcXKSKQ1uwe6oQh1QIQQIpSUmoOEQQiVslpCZpEseN49faXu/rZ3bXduz1rnfiR0KRf2nkfc3M97/mnzFAQxrSkMdabGYvohdHXYDoQy7NYCYDIMtA7rWXud+cZO8x/3z3fcc33xXNEXZ/gKD/DkE3LhYMoV0Enh2B8UuDJbxNRvDin++4hPv/zCWnwBi8iB8tlSgUObxt0FengG6Ma33jsNDyiuF4dsOnUtLX1P03PDGwZuFAE49QCV2f6wr8sUHT94YeQHGHUX6bn4+qE61Pd5d17671rRULS7Jh+GldtLE7Dtmo4E0VACmdh1CUcCTs3uDdzuXSSYtdXcRr4hWiQL9x3AP09J7wHYpGGEiycP25T2Gha7CyJBZ+O446V/c7Xl+fr+dqErkw7JdDQbcci5XA52CmP2uz0eWA2gWp47Rq+LGzGnw8TuC1sJF51sxRNArsn6jwW1n4PmL5Y2dAzsRIFIeXafrby68S9fVE3vIJDX4xCy+ymwHHkRPeKhSof+hEvAVh0+dV4aUs/J0vXvTQjtNUfqnG+sFnw+aGYvmuNw3hsWIFEPfF8gr8ggk8LY7dulrWLgf08OXChnZGi2W0dvLH0FuuzbWHxfDc3mO+gmW0Nsq8fPvn+Ug84bnS8xGJec3yArthCi/EVtXGx1ZAiJNGfukr8d0uPXG/442tmlTiMxeX3HbHYb8spAKzlyu3/IEVMgIdIPD9tYA/kFUoq0TN9lUHvpWojwfqVIkv3Ex9To4Dp696Dr9n9e2HV5MuQjFXiHRrtNV2YB4g8EPRFF7aZnHok5upMavvwyzCDmnhglZBHaArZOLSgJM0U6jh2YneSOv3/kcJhHhabT6iBEN96MR65wAKUyBGfeJSv9vwgIfS1IrtByfXGVBZFEU4HqZGAylndSfmGmynCbQPuYcuTD+Ar+NHfWdnJxid9f0byRAjowx82z1QlFD+6AjF5V6SD/5qz/5VbacJ/BDwW2MgxmCSfQFuRZqdnMTPESWcWXh3KB12JwUuvzLzbb9DutMPGRFAyQfihTEaeKwohJRZc60UngEp4cfMpgo/kzkOipXXkyGniNIcgXclhKRvh4sXQGjjCO33VCVy+TASMMgHpDOnvSy4qeVdTpA5Pwkb5yR7SoXPAQqyAGtskFE8EUxuO/XwuWu+XfOEmg8CTI2UyYd6bOZ8mF5hJhMnYTrztApUCMiJPDyIr5PklQ3h83suEk7JDr+WD5JxPlgd6vdcyGKLA+5Vsi2+EX0G5vmnyJNM6f9dJai6JwUvJLgDohwH+8b7Q+evPXJ/dY5kedUnsjJy5NVflQlIu1/DMnebtAlTE5bbmu3rVqKiEoNV58B/Ax4fNw8g5TJqqADH26Clebfbt/JrzMe/nCqzTiGlCbBMaGDRFRuaYWKrb++uQiK3FwUAWhxa18vsaViy9fgAoiWT0fjJcC1Cim+fnIH00TVoCQ2rt/JeFIiy9mVnq8wo8NNqkYqYWtrK7GixuBaHChYP1r6oXrUEPaRuRpepkziVsXknVk7CT+nufJEyhTfZ7+n7lNyjBXxW+NYFYB1XiAdSHup/JRR56ct3XUrFtTXbGZvDrqmKew0Xgy6oR0XjHjKCzJO3GUmxvOev8R+XoSENacj/T/4VYACY3V5vRvjUNwAAAABJRU5ErkJggg==
// @match           *://*.google.com/search*
// @match           *://*.google.ad/search*
// @match           *://*.google.ae/search*
// @match           *://*.google.com.af/search*
// @match           *://*.google.com.ag/search*
// @match           *://*.google.al/search*
// @match           *://*.google.am/search*
// @match           *://*.google.co.ao/search*
// @match           *://*.google.com.ar/search*
// @match           *://*.google.as/search*
// @match           *://*.google.at/search*
// @match           *://*.google.com.au/search*
// @match           *://*.google.az/search*
// @match           *://*.google.ba/search*
// @match           *://*.google.com.bd/search*
// @match           *://*.google.be/search*
// @match           *://*.google.bf/search*
// @match           *://*.google.bg/search*
// @match           *://*.google.com.bh/search*
// @match           *://*.google.bi/search*
// @match           *://*.google.bj/search*
// @match           *://*.google.com.bn/search*
// @match           *://*.google.com.bo/search*
// @match           *://*.google.com.br/search*
// @match           *://*.google.bs/search*
// @match           *://*.google.bt/search*
// @match           *://*.google.co.bw/search*
// @match           *://*.google.by/search*
// @match           *://*.google.com.bz/search*
// @match           *://*.google.ca/search*
// @match           *://*.google.cd/search*
// @match           *://*.google.cf/search*
// @match           *://*.google.cg/search*
// @match           *://*.google.ch/search*
// @match           *://*.google.ci/search*
// @match           *://*.google.co.ck/search*
// @match           *://*.google.cl/search*
// @match           *://*.google.cm/search*
// @match           *://*.google.cn/search*
// @match           *://*.google.com.co/search*
// @match           *://*.google.co.cr/search*
// @match           *://*.google.com.cu/search*
// @match           *://*.google.cv/search*
// @match           *://*.google.com.cy/search*
// @match           *://*.google.cz/search*
// @match           *://*.google.de/search*
// @match           *://*.google.dj/search*
// @match           *://*.google.dk/search*
// @match           *://*.google.dm/search*
// @match           *://*.google.com.do/search*
// @match           *://*.google.dz/search*
// @match           *://*.google.com.ec/search*
// @match           *://*.google.ee/search*
// @match           *://*.google.com.eg/search*
// @match           *://*.google.es/search*
// @match           *://*.google.com.et/search*
// @match           *://*.google.fi/search*
// @match           *://*.google.com.fj/search*
// @match           *://*.google.fm/search*
// @match           *://*.google.fr/search*
// @match           *://*.google.ga/search*
// @match           *://*.google.ge/search*
// @match           *://*.google.gg/search*
// @match           *://*.google.com.gh/search*
// @match           *://*.google.com.gi/search*
// @match           *://*.google.gl/search*
// @match           *://*.google.gm/search*
// @match           *://*.google.gr/search*
// @match           *://*.google.com.gt/search*
// @match           *://*.google.gy/search*
// @match           *://*.google.com.hk/search*
// @match           *://*.google.hn/search*
// @match           *://*.google.hr/search*
// @match           *://*.google.ht/search*
// @match           *://*.google.hu/search*
// @match           *://*.google.co.id/search*
// @match           *://*.google.ie/search*
// @match           *://*.google.co.il/search*
// @match           *://*.google.im/search*
// @match           *://*.google.co.in/search*
// @match           *://*.google.iq/search*
// @match           *://*.google.is/search*
// @match           *://*.google.it/search*
// @match           *://*.google.je/search*
// @match           *://*.google.com.jm/search*
// @match           *://*.google.jo/search*
// @match           *://*.google.co.jp/search*
// @match           *://*.google.co.ke/search*
// @match           *://*.google.com.kh/search*
// @match           *://*.google.ki/search*
// @match           *://*.google.kg/search*
// @match           *://*.google.co.kr/search*
// @match           *://*.google.com.kw/search*
// @match           *://*.google.kz/search*
// @match           *://*.google.la/search*
// @match           *://*.google.com.lb/search*
// @match           *://*.google.li/search*
// @match           *://*.google.lk/search*
// @match           *://*.google.co.ls/search*
// @match           *://*.google.lt/search*
// @match           *://*.google.lu/search*
// @match           *://*.google.lv/search*
// @match           *://*.google.com.ly/search*
// @match           *://*.google.co.ma/search*
// @match           *://*.google.md/search*
// @match           *://*.google.me/search*
// @match           *://*.google.mg/search*
// @match           *://*.google.mk/search*
// @match           *://*.google.ml/search*
// @match           *://*.google.com.mm/search*
// @match           *://*.google.mn/search*
// @match           *://*.google.com.mt/search*
// @match           *://*.google.mu/search*
// @match           *://*.google.mv/search*
// @match           *://*.google.mw/search*
// @match           *://*.google.com.mx/search*
// @match           *://*.google.com.my/search*
// @match           *://*.google.co.mz/search*
// @match           *://*.google.com.na/search*
// @match           *://*.google.com.ng/search*
// @match           *://*.google.com.ni/search*
// @match           *://*.google.ne/search*
// @match           *://*.google.nl/search*
// @match           *://*.google.no/search*
// @match           *://*.google.com.np/search*
// @match           *://*.google.nr/search*
// @match           *://*.google.nu/search*
// @match           *://*.google.co.nz/search*
// @match           *://*.google.com.om/search*
// @match           *://*.google.com.pa/search*
// @match           *://*.google.com.pe/search*
// @match           *://*.google.com.pg/search*
// @match           *://*.google.com.ph/search*
// @match           *://*.google.com.pk/search*
// @match           *://*.google.pl/search*
// @match           *://*.google.pn/search*
// @match           *://*.google.com.pr/search*
// @match           *://*.google.ps/search*
// @match           *://*.google.pt/search*
// @match           *://*.google.com.py/search*
// @match           *://*.google.com.qa/search*
// @match           *://*.google.ro/search*
// @match           *://*.google.ru/search*
// @match           *://*.google.rw/search*
// @match           *://*.google.com.sa/search*
// @match           *://*.google.com.sb/search*
// @match           *://*.google.sc/search*
// @match           *://*.google.se/search*
// @match           *://*.google.com.sg/search*
// @match           *://*.google.sh/search*
// @match           *://*.google.si/search*
// @match           *://*.google.sk/search*
// @match           *://*.google.com.sl/search*
// @match           *://*.google.sn/search*
// @match           *://*.google.so/search*
// @match           *://*.google.sm/search*
// @match           *://*.google.sr/search*
// @match           *://*.google.st/search*
// @match           *://*.google.com.sv/search*
// @match           *://*.google.td/search*
// @match           *://*.google.tg/search*
// @match           *://*.google.co.th/search*
// @match           *://*.google.com.tj/search*
// @match           *://*.google.tl/search*
// @match           *://*.google.tm/search*
// @match           *://*.google.tn/search*
// @match           *://*.google.to/search*
// @match           *://*.google.com.tr/search*
// @match           *://*.google.tt/search*
// @match           *://*.google.com.tw/search*
// @match           *://*.google.co.tz/search*
// @match           *://*.google.com.ua/search*
// @match           *://*.google.co.ug/search*
// @match           *://*.google.co.uk/search*
// @match           *://*.google.com.uy/search*
// @match           *://*.google.co.uz/search*
// @match           *://*.google.com.vc/search*
// @match           *://*.google.co.ve/search*
// @match           *://*.google.co.vi/search*
// @match           *://*.google.com.vn/search*
// @match           *://*.google.vu/search*
// @match           *://*.google.ws/search*
// @match           *://*.google.rs/search*
// @match           *://*.google.co.za/search*
// @match           *://*.google.co.zm/search*
// @match           *://*.google.co.zw/search*
// @match           *://*.google.cat/search*
// @match           *://*.google.com.ai/search*
// @match           *://*.google.hk/search*
// @match           *://*.google.jp/search*
// @match           *://*.google.ms/search*
// @match           *://*.google.vg/search*
// @grant           none
// @run-at          document-end
// @noframes
// ==/UserScript==

/* ---- Settings: edit to taste (empty text = browser language) ---- */
const VIEW_IMAGE_SETTINGS = {
    openInNewTab: true,
    noReferrer: true, // some CDNs (e.g. Bilibili) reject a google.com Referer
    showSearchByImage: true,
    thumbnailFallback: true, // "View thumbnail" when the original image fails to load
    viewImageText: '',
    viewThumbnailText: '',
    searchByImageText: '',
    debug: false,
};
/* ------------------------------------------------------------------ */

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

(() => {
    const labels = {"ca":{"view":"Mostra la imatge","search":"Cerca per imatge"},"cs":{"view":"Zobrazit obrázek","search":"Vyhledat podle obrázku"},"da":{"view":"Vis billede","search":"Søg efter billede"},"de":{"view":"Bild ansehen","search":"Zur \"Bildersuche\""},"en":{"view":"View image","thumbnail":"View thumbnail","search":"Search by image"},"es":{"view":"Ver imagen","search":"Buscar por imagen"},"fr":{"view":"Voir l'image","search":"Recherche par image"},"he":{"view":"הצג תמונה","search":"חפש לפי תמונה"},"hu":{"view":"Kép megtekintése","search":"Keresés kép alapján"},"it":{"view":"Visualizza immagine","search":"Ricerca tramite immagine"},"ja":{"view":"画像を表示","search":"画像を検索"},"ko":{"view":"이미지 보기","search":"이미지로 검색"},"nl":{"view":"Afbeelding weergeven","search":"Afbeelding zoeken"},"no":{"view":"Se bilde","search":"Søk med bilde"},"pl":{"view":"Pokaż obraz","search":"Wyszukaj obrazem"},"pt":{"view":"Ver imagem","search":"Pesquisar por imagem"},"pt-br":{"view":"Ver imagem","search":"Pesquisar por imagem"},"pt-pt":{"view":"Ver imagem","search":"Pesquisar por imagem"},"ru":{"view":"Открыть в полном размере","search":"Поиск по картинке"},"si":{"view":"පින්තුරය බලන්න","search":"පින්තුරය මගින් සෙවීම"},"sk":{"view":"Zobraziť obrázok","search":"Vyhľadať podľa obrázku"},"sl":{"view":"Ogled slike","search":"Iskanje s sliko"},"sv":{"view":"Visa originalbilden","search":"Fler storlekar"},"tr":{"view":"Resmi Görüntüle","search":"Görselle Ara"},"zh-cn":{"view":"查看图片","search":"以图搜图"},"zh-tw":{"view":"檢視圖片","search":"以圖搜圖"}};
    const language = (navigator.language || 'en').toLowerCase();
    const label = labels[language] || labels[language.split('-')[0]] || labels.en;
    ViewImageCore.start({
        ...VIEW_IMAGE_SETTINGS,
        viewImageText: VIEW_IMAGE_SETTINGS.viewImageText || label.view || labels.en.view,
        viewThumbnailText: VIEW_IMAGE_SETTINGS.viewThumbnailText || label.thumbnail || labels.en.thumbnail,
        searchByImageText: VIEW_IMAGE_SETTINGS.searchByImageText || label.search || labels.en.search,
    });
})();
