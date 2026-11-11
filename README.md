# Lucky Baraka, portfolio

React and Vite. Charcoal and teal, dark only.

## Run it

    npm install
    npm run dev

## Edit the words

Everything people read is in `src/data.js`: the hero, about, quotes, stack, projects, achievements and blog categories. Look for the `TODO` note: the frontend and full stack projects still have bracketed placeholders, and every project link points at your GitHub profile until you swap in the real repos.

## Make the contact form send email

1. Go to https://web3forms.com, enter luckybaraka21@gmail.com and copy the access key they email you.
2. Locally: copy `.env.example` to `.env` and paste the key.
3. On GitHub: Settings, Secrets and variables, Actions, add a secret named `VITE_WEB3FORMS_KEY`.

Without a key, the form still works: it opens the visitor's mail app with the message filled in.

## Blog posts

The Writing page reads https://luckybaraka.github.io/feed.xml when someone opens it, so new posts show up on their own. If the feed can't be reached, it shows the saved list in `src/data.js`. To change which posts land under which chip, edit `match` in `blogCategories`.

## Deploy

Push to `main` on a new repo (for example `portfolio`). In the repo, go to Settings, Pages, and set Source to GitHub Actions. The workflow in `.github/workflows/deploy.yml` builds and publishes it to https://luckybaraka.github.io/portfolio/.

Your photo is `public/lucky.jpg`. Replace it with the same name to swap it.
