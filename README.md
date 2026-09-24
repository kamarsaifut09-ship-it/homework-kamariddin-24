# BMW X6 M Competition Configurator

Student implementation for Homework #24 Vibe Coding.

## Run
Use a local server (for example VS Code Live Server) and open `index.html` through the server. `fetch()` loads `data/config.json`, so opening the file directly with `file://` may block the request in some browsers.

## Structure
- `index.html`
- `css/style.css`
- `js/script.js`
- `data/config.json`
- `images/exterior/<color>/1.png ... 6.png`
- `images/interior/1.png ... 5.png`

The supplied image archive contained five exterior frames per color while the assignment specifies six filenames. The sixth required file is therefore kept in the required `1–6` schema using the final supplied frame.
