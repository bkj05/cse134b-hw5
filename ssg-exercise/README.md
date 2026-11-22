# Two pages, one footer

From the repository root, with Node.js 20 or later and npm installed:

```sh
cd ssg-exercise
npm ci
npm run build
npm start
```

Open **http://localhost:8080/** (Home) and **http://localhost:8080/about.html**
(About). The preview command prints its address if the default port is busy.
Press Ctrl+C to stop it.

`src/index.njk` and `src/about.njk` contain the two pages’ original main
content. Both use `src/_includes/layout.njk`, which includes
`src/_includes/footer.njk` once. The preview has its own copies of the
stylesheet, theme script, portrait and illustrations. Links to other
portfolio pages open the main website.

To see how a single edit reaches both pages, change some text in
`src/_includes/footer.njk`. The running preview rebuilds automatically;
refresh Home and About and check their footers. For a one-time build,
`npm run build` writes both finished HTML files to `_site/`.
