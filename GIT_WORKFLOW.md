# Git Workflow — Quick Reference

## One-time setup (per clone)
```sh
git config core.hooksPath .githooks
chmod +x .githooks/commit-msg
chmod +x .githooks/pre-push
```

---

## Daily workflow

```
feature branch  →  commits  →  push branch  →  PR  →  merge to main
```

### 1. Start a new feature
```sh
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

### 2. Commit as you work
```sh
git add .
git commit -m "feat: add GBIF harvester"
```
The hook runs automatically. If your message is rejected it will tell you why.

**Commit message format:**
```
<type>: <subject>          ← max 50 chars, imperative tense

Optional body here.        ← blank line required before this
Explain why, not how.      ← 2-4 sentences is enough
```
Valid types: `feat` `fix` `docs` `refactor` `chore` `test` `style`

### 3. Push your branch
```sh
git push origin feat/your-feature-name
```
Direct pushes to main are blocked by the hook.

### 4. Before opening a PR — review your commits
```sh
git log main..HEAD --oneline
```
This shows everything on your branch not yet in main. Use it to fill in the PR description — paste it into the "Commits in this branch" section.

### 5. Open the PR on GitHub
- Go to your repo on GitHub
- Click **"Compare & pull request"** on your branch
- The PR template will pre-fill — complete each section
- Merge when ready

### 6. After merging — clean up
```sh
git checkout main
git pull origin main
git branch -d feat/your-feature-name
```

---

## Commit message examples

```sh
# Simple — no body needed
git commit -m "docs: update roadmap phase 2a"
git commit -m "chore: add .env.dev and .env.prod examples"

# With body — use your editor (omit -m flag)
git commit
```
```
fix: handle empty response from GBIF API

GBIF returns 200 with empty results array for unknown species
rather than 404. Added guard before attempting to iterate.

Closes #8
```

---

## Hook behaviour

| Situation | What happens |
|---|---|
| Invalid prefix | Hook rejects, shows valid types |
| Subject over 50 chars | Hook rejects, explains fix |
| No blank line before body | Hook rejects, shows format |
| Push directly to main | Hook blocks, reminds you to use a PR |
| Merge commit | Hook skips all checks |
| Doc-only change | Works fine — just use `docs:` prefix |