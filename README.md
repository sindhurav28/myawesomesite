# 💖 Our Journey — A Birthday Website

A little interactive map of everywhere we've travelled together, with a dotted
trail tracing our story and a photo page for every place. Made as a birthday gift.

---

## 🖥️ How to see it

**On your computer:** just double-click `index.html` — it opens in your browser.

> Note: the photo pages need to run from a web server or from GitHub Pages to
> load properly. Double-clicking works for a quick preview, but publishing it
> (below) is how you'll share it.

---

## 🌐 Publishing it (free) so he can open it from a link

1. Push this folder to your GitHub repository (already done if you're reading this there).
2. On GitHub, go to your repo → **Settings** → **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch (`claude/birthday-travel-map-website-jer7wl` or `main` after you merge) and folder **/ (root)**, then **Save**.
5. Wait ~1 minute. GitHub gives you a link like
   `https://<your-username>.github.io/myawesomesite/` — that's the one you share! 🎁

---

## ✏️ How to personalize it (no coding needed)

### 1. Change the birthday message
Open **`index.html`** and find the section that starts with
`<!-- ✏️ EDIT ME -->`. Rewrite the message in your own words. You can add his
name in the heading "To the love of my life".

### 2. Edit the memories for each place
Open **`js/data.js`**. Each place is a little block. Change the text inside the
quotes for:
- `memory` → your story for that place (can be as long as you want)
- `date`, `name`, `subtitle` → the labels shown on the map & page

Keep the commas, quotes, and brackets exactly where they are. 🙂

### 3. Add your photos
1. Put your photo files into the matching folder inside **`photos/`**.
   Example: photos of Hawaii go in `photos/hawaii-2025/`.
2. In `js/data.js`, find that place and list the file names in `photos`, like:
   ```
   photos: ["beach.jpg", "sunset.jpg", "us.jpg"]
   ```
3. Save. Done! The photos appear automatically, and clicking one opens it big.

---

## 📅 Dates I guessed

You didn't give me dates for a few places, so I placed them on the trail using my
best guess (they're marked with `guessDate: true` in `js/data.js`):
**Amicalola Falls, Washington D.C., San Francisco, Carmel-by-the-Sea, Mount Shasta.**
To reorder the trail, just change the `sort` value for that place.

---

Made with ♥
