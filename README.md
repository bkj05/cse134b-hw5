# Benjamin Kettor Jr. · CSE 134B HW5

[Portfolio](https://bkj05.github.io/cse134b-hw5/) · [Between sets](https://bkj05.github.io/cse134b-hw5/beyond-coding.html#practice-break)

## Between sets

A visitor reading about music on **Beyond Coding** can take a one-joke break
without leaving the page. *Next music pun* cycles through two local jokes.
*Get a guest joke* sends a GET request to [icanhazdadjoke](https://icanhazdadjoke.com/api)
with `Accept: application/json`. The last joke stays visible while the status
says “Loading a guest joke…”. After checking the HTTP status and that the JSON
`joke` field contains nonempty text, the component puts that text in the
existing paragraph with `textContent`. The live region announces success.
If the network fails, the response is malformed, or the request times out,
the last joke stays. The same button becomes *Retry guest joke*; a successful
retry clears the error without reloading. The two music puns also work offline
once the page has loaded.

The page’s *Compact view* button toggles the `compact` attribute on
`<encore-jokes>`. Its `attributeChangedCallback()` hides or reveals the source
line, and CSS changes the spacing without changing the selected joke. The
button’s pressed state reflects the view. `hw5-encore-jokes-view` stores
`expanded` or `compact`, separately from the site theme. An unknown value
or failed read uses expanded view; a failed write does not undo a click.

The component is in `assets/encore-jokes.js`; the surrounding portfolio sets
its colors in `assets/styles.css`. With scripting off, one music pun, the
portfolio content and the navigation are still available.

## Static site generator exercise

Open [ssg-exercise/](ssg-exercise/) to build the **Home** (`index.html`) and
**About** (`about.html`) pages with Eleventy. Their shared footer lives in
one Nunjucks include. [Install, build and preview instructions](ssg-exercise/README.md).

The main portfolio is regular HTML, CSS and JavaScript, served by GitHub
Pages from the root of `main`. The exercise is built separately. To preview
the portfolio on your own computer, run `python3 -m http.server 8000` in
the repository root and visit `http://localhost:8000/`.
