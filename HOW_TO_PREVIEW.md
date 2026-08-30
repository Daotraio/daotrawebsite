# Previewing Daotra on Your Own Computer

Two options here, from easiest to most complete:

- **Option A — instant, zero install.** Open `preview.html` in your browser.
  This shows you the homepage design, including the working 3D globe, with
  no setup at all. It's a static mockup, not the real running app — links,
  forms, and the other pages won't work.
- **Option B — the real app, running on your computer.** Takes about
  10 minutes the first time, using the steps below. This is the actual
  Next.js project — every page, every form, really works.

This guide is Option B, written for someone who has never used a terminal
before. Follow it top to bottom; you can't skip steps.

---

## Step 1 — Install Node.js

Node.js is the software that runs this project. You only need to do this once.

1. Go to **[nodejs.org](https://nodejs.org)**.
2. Click the big green button — it will say something like "Download Node.js
   (LTS)". LTS means "long-term support," which is the stable version you
   want.
3. Open the file you downloaded and click through the installer with the
   default options (keep clicking "Next" / "Continue" / "Install").
4. When it's done, **restart your computer**. This step is easy to skip but
   important — without it, your computer won't recognize the commands below.

---

## Step 2 — Open a terminal

A terminal is just a window where you type commands instead of clicking.

- **On a Mac:** Press `Cmd + Space`, type `Terminal`, press Enter.
- **On Windows:** Press the `Windows key`, type `PowerShell`, press Enter.

A plain black or white window will open with some text and a blinking
cursor. That's it — that's the terminal.

---

## Step 3 — Unzip the project

1. Find the `daotra-platform.zip` file you downloaded (probably in your
   Downloads folder).
2. Double-click it to unzip it. This creates a folder called `daotra` (or
   similar) in the same location.
3. **Remember where this folder is** — you'll need to tell the terminal how
   to get there in the next step. If it's in your Downloads folder, that's
   `Downloads/daotra`.

---

## Step 4 — Navigate to the project folder in the terminal

In your terminal window, type `cd ` (with a space after it — don't press
Enter yet), then drag the unzipped `daotra` folder from Finder (Mac) or File
Explorer (Windows) directly into the terminal window. It will automatically
paste the correct folder path. Now press **Enter**.

Your terminal command should look something like this before you press Enter:

```
cd /Users/yourname/Downloads/daotra
```

or on Windows:

```
cd C:\Users\yourname\Downloads\daotra
```

---

## Step 5 — Install the project's dependencies

Still in the terminal, type exactly this and press Enter:

```
npm install
```

You'll see a bunch of text scroll by — this is normal. It's downloading all
the building blocks the site needs (this project uses Next.js, React,
Tailwind CSS, and a few others). **This takes 1–3 minutes** depending on your
internet connection. Wait until you see the blinking cursor again with no
more text appearing — that means it's done.

If you see the word "error" in red, see the Troubleshooting section below.

---

## Step 6 — Start the site

Type this and press Enter:

```
npm run dev
```

After a few seconds you'll see something like:

```
✓ Ready in 1200ms
- Local:  http://localhost:3000
```

---

## Step 7 — View it in your browser

Open your web browser (Chrome, Safari, Firefox — any of them) and go to:

```
http://localhost:3000
```

That's the live site, running on your own computer. Click around — the
navigation, the globe, the forms all work. **Note:** buttons that go to
`aff.daotra.io` or `adv.daotra.io` (like "Publisher Login") won't load,
since those subdomains only exist once the site is deployed to Cloudflare —
see the main `README.md` for that step.

To stop the site, click back into the terminal window and press `Ctrl + C`.
To start it again later, repeat Step 4 and Step 6 (you don't need to repeat
Step 5 unless you've changed the project files).

---

## Troubleshooting

**"npm: command not found" or "npm is not recognized"**
Node.js isn't installed correctly, or you skipped the restart in Step 1. Go
back, reinstall Node.js, and make sure to restart your computer afterward.

**"npm error" with a lot of red text after `npm install`**
Usually a connectivity hiccup. Just run `npm install` again — it's safe to
run more than once.

**The browser shows "This site can't be reached" at localhost:3000**
Make sure the terminal window from Step 6 is still open and running (look
for the "Local: http://localhost:3000" text) — closing that window stops the
site.

**Nothing happens when I paste the folder into the terminal in Step 4**
Make sure your cursor is in the terminal window and there's a space right
after `cd` before you drag the folder in.

---

## Sharing this with someone else: staging vs. production

Running on your own computer (Steps 1–7 above) is only visible to you. To
get a real, shareable web address, the project needs to be deployed to
Cloudflare — and this project is set up with **two separate environments**
so you never accidentally show unfinished work to real users:

- **Staging** — a test copy, at a free web address Cloudflare gives you
  automatically. Use this to check that changes actually work before anyone
  important sees them.
- **Production** — the real `daotra.io` site.

Here's the full path, continuing on from Step 5 above (you should already
have Node.js installed and the project unzipped).

### Step 8 — Install Git

Git is the tool that uploads your project to GitHub. Go to
**[git-scm.com/download/win](https://git-scm.com/download/win)** — the
download should start automatically. Run the installer, clicking "Next" on
every screen (the defaults are fine). Restart your terminal (close it and
reopen it, per Step 2) afterward.

### Step 9 — Create the GitHub repository

1. Go to **[github.com](https://github.com)** and log in.
2. Click the **+** icon (top right) → **New repository**.
3. Name it `daotra`, leave it Private or Public (your choice), and click
   **Create repository** — don't check any of the boxes for adding a README
   or `.gitignore`, since this project already has them.
4. GitHub will show you a page with some commands under "…or push an
   existing repository from the command line." Keep that page open — you'll
   need the URL from it in the next step (it looks like
   `https://github.com/your-username/daotra.git`).

### Step 10 — Push the project to GitHub

Back in your terminal (still inside the `daotra` folder from Step 4), run
these one at a time, pressing Enter after each:

```
git init
git add .
git commit -m "Initial Daotra platform"
git branch -M main
git remote add origin https://github.com/your-username/daotra.git
git push -u origin main
```

Replace the URL in the fifth line with the actual one from Step 9. The first
time you push, a browser window may pop up asking you to log into GitHub —
that's normal, just follow the prompts.

Now create a second branch for staging, and push that too:

```
git checkout -b staging
git push -u origin staging
```

You now have two branches on GitHub: `main` (production) and `staging` (test).

### Step 11 — Connect Cloudflare

1. In the Cloudflare dashboard, go to **My Profile → API Tokens → Create
   Token**, choose the **"Edit Cloudflare Workers"** template, and create it.
   Copy the token somewhere safe — you won't be able to see it again.
2. Find your **Account ID** — it's in the right sidebar of any page under
   **Workers & Pages** in the Cloudflare dashboard.
3. Back on GitHub, go to your repository → **Settings → Secrets and
   variables → Actions → New repository secret**, and add two secrets:
   - Name: `CLOUDFLARE_API_TOKEN` — value: the token from step 1
   - Name: `CLOUDFLARE_ACCOUNT_ID` — value: the ID from step 2

That's it — from now on, every time you push to the `staging` branch,
GitHub automatically builds and deploys it to your staging address. Every
push to `main` deploys to production.

### Step 12 — First deploy from your own computer (optional but recommended)

Rather than waiting on GitHub, you can trigger the very first deploy
yourself, which also gives you the exact staging web address to bookmark.
In your terminal:

```
npm run deploy:staging
```

The first time, it will open a browser window asking you to log into
Cloudflare and authorize Wrangler (the deploy tool) — approve it, then
return to the terminal. When it finishes, it prints a URL like:

```
https://daotra-staging.your-subdomain.workers.dev
```

That's your test environment — open it in a browser to check everything
works. When you're happy and ready to go live for real, run:

```
npm run deploy:production
```

This deploys to the `daotra` Worker. It won't be reachable at `daotra.io`
yet until you also do the one-time domain setup in `README.md` under
"Pointing daotra.io (and the aff./adv. portals) at production" — that part
is a few clicks in the Cloudflare dashboard, not a terminal command.

### After this one-time setup

Day to day, you won't repeat Steps 8–11. Your loop becomes:

1. Make changes to the project files.
2. Test locally with `npm run dev` (Steps 4–7 above).
3. When happy, push to `staging` (`git add .`, `git commit -m "..."`,
   `git push`) and check the staging URL.
4. When staging looks right, merge `staging` into `main` and push — that's
   what goes live on the real site.
