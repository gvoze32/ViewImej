# ViewImej

Brings back the **View image** and **Search by image** buttons in Google Images.
**View image** opens the original image, not Google's `encrypted-tbn0.gstatic.com` thumbnail.

A maintained fork of [View Image](https://github.com/bijij/ViewImage).

## Install

Use **one** of these. Turn off the old View Image extension or userscript first.

### Userscript (all browsers, including Safari)

1. Install a userscript manager: [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/),
   or [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) for Safari.
2. Open **[viewimej.user.js](https://raw.githubusercontent.com/gvoze32/ViewImej/main/userscript/viewimej.user.js)**,
   then click **Install**.

Updates arrive automatically through the manager.

### Chrome, Edge, Brave, Opera

1. Download `viewimej-chrome-<version>.zip` from [Releases](https://github.com/gvoze32/ViewImej/releases/latest), then unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked**, then choose the unzipped folder.

### Firefox 140+

1. Download `viewimej-firefox-<version>.zip` from [Releases](https://github.com/gvoze32/ViewImej/releases/latest), then unzip it.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on**, then pick `manifest.json` from the unzipped folder.

A temporary add-on is removed when Firefox restarts. A permanent install needs the add-on signed through
[AMO](https://addons.mozilla.org/developers/).

### Updating the extension

Click the extension icon, then **Check for updates**. If a newer version exists, download it and load it the
same way you installed it.

## Settings

- **Extension:** click the extension icon, then **Options**.
- **Userscript:** edit the `VIEW_IMAGE_SETTINGS` block at the top of the script.

| Setting | Default |
| --- | --- |
| Open in a new tab | on |
| Hide referrer | on |
| Show **Search by image** | on |
| Show **View thumbnail** when the original can't be opened | on |
| Custom button text | off |

**View thumbnail** appears instead of **View image** when the original doesn't load as an image. This happens
for Instagram, Facebook, TikTok and Threads results, expired links, and sites that block direct image links.

## Build from source

```
npm run build
```

This needs Node 18+ and `zip`. The extensions go to `dist/` and the userscript to `userscript/viewimej.user.js`.

To release a new version:

1. Bump `version` in `package.json`.
2. Run the build.
3. Commit and push.
4. Run `gh release create v<version> dist/viewimej-*-<version>.zip userscript/viewimej.user.js`.

## Credits

- Original extension by [Joshua Butt (bijij)](https://github.com/bijij/ViewImage), MIT
- Userscript upkeep and research by [ner00](https://gist.github.com/ner00/ec9ae47e202b8e99f19be44a5af6baf3)
- Icon by [Daniel Hickman](https://github.com/danielhickman)
