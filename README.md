# View Image (revived)

Brings back the **View image** and **Search by image** buttons in Google Images. Available as a
browser extension (Chrome/Edge/Brave/Opera, Firefox) and as a userscript.

This is a fork of [bijij/ViewImage](https://github.com/bijij/ViewImage), which is no longer
maintained. It also covers the userscript forks by
[bijij](https://gist.github.com/bijij/58cc8cfc859331e4cf80210528a7b255) and
[ner00](https://gist.github.com/ner00/ec9ae47e202b8e99f19be44a5af6baf3).

## What changed

| Problem (upstream issue / gist report) | Fix |
| --- | --- |
| Buttons gone after Google's 2025–2026 redesign (#285, #287, #288, #292, #294) | Class names are no longer used to find things. The script finds the preview's **Visit** button by structure (external link + icon + label) and takes the image id (`tbnid`) from the data Google puts in the page. |
| **View image** opens the `encrypted-tbn0.gstatic.com` thumbnail instead of the original | The preview `<img>` shows a thumbnail until the original loads, and it never loads when the source site blocks hotlinking. The original URL is now read by `tbnid` from Google's `/imgres?imgurl=…&tbnid=…` links and from its inline result JSON. Thumbnail URLs are never used. |
| Button shows up for a moment, then disappears (#286) | A `MutationObserver` puts the buttons back every time Google re-renders the panel. |
| Middle-click or Ctrl-click on the button opens the source website, or breaks the next click | Google's delegated click/mousedown handlers no longer receive events from the buttons, so every click type just follows the `href`. |
| Results loaded by infinite scroll, `udm=2`/`udm=imgs`/`tbm=isch` URLs, the retired country domains | Runs on every `google.<tld>/search*` page. The legacy "basic" image layout (`#imgrc=`, `data-ou`) also works. |
| `runtime.getPlatformInfo().nacl_arch` is deprecated (#294) | Uses `info.arch`. The background service worker is gone; it only existed to store default options. |
| Search by image was removed upstream | Brought back through Google Lens (`lens.google.com/uploadbyurl`). It can be turned off. |

## Install

Build first: `npm run build` (needs Node 18+ and `zip`). The output goes to `dist/`.

### Userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Open `dist/viewimage.user.js` with the manager, or create a new script and paste the file in.
3. To change settings, edit the `VIEW_IMAGE_SETTINGS` block at the top of the script.

Turn off the old View Image extension and the old userscripts. If two copies run, the second
one does nothing and logs a console warning.

### Chrome / Edge / Brave / Opera

`chrome://extensions` → turn on Developer mode → **Load unpacked** → choose `dist/chrome`
(or upload `dist/view-image-chrome-<version>.zip` to the Chrome Web Store).

### Firefox (140+)

For a quick test, open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → pick
`dist/firefox/manifest.json`. To install it permanently, sign
`dist/view-image-firefox-<version>.zip` on AMO. Before you publish, change the add-on id
`view-image-revived@viewimej` in `scripts/build.mjs`.

## Layout

```
src/core.js            shared logic (extension + userscript)
extension/             extension assets: options/popup pages, locales, icons, content-script glue
scripts/build.mjs      generates manifests (Chrome, Firefox) and the userscript from the sources above
scripts/tlds.json      Google domains to match
```

## How the original URL is found

For the preview that is open, the tbnid comes from Google's `<link href="/imgres?…&tbnid=">`, from the
preview card's `jsdata`, or from the `#sv=` / `#imgrc=` hash. The original is then the first
of these that exists:

1. `imgurl` from an `/imgres?…&tbnid=<id>` link or anchor
2. the `[0,"<id>",[thumb,h,w],[original,h,w]…]` entry in Google's inline result data
3. `data-ou` on the tile (legacy layout)
4. the preview `<img>`, but only once its `src` is no longer a gstatic thumbnail

If none of these is available yet, no button is shown. The button is never pointed at a thumbnail.

## Credits

- Original extension by [Joshua Butt (bijij)](https://github.com/bijij/ViewImage), MIT
- Userscript upkeep and research by [ner00](https://gist.github.com/ner00/ec9ae47e202b8e99f19be44a5af6baf3)
- Icon by [Daniel Hickman](https://github.com/danielhickman)
