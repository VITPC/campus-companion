# Campus Companion

A student companion app for **YIBS**, built with React Native and Expo. It is a teaching project: each screen is split into GitHub issues, and every student builds one issue at a time.

- **Home**: announcements and today's timetable, expanding to the full week
- **Courses**: course list → course detail → results, notes and assignments
- **Profile**: language settings, profile photo, preferences

The UI design for every screen is in [`design/`](design/README.md). Colours, fonts and spacing are in [`constants/theme.ts`](constants/theme.ts); always use these instead of hard-coded values.

---

## Setup

### 1. Install the tools

| Tool | Why | Check it works |
|---|---|---|
| [Git](https://git-scm.com/downloads) | Version control | `git --version` |
| [Node.js](https://nodejs.org/) (LTS) | Runs the Expo tooling | `node --version` |
| [Bun](https://bun.sh/) | Package manager for this project | `bun --version` |
| **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) | Runs the app on your phone | Open it once |

An Android emulator (Android Studio) or the iOS Simulator (Xcode, macOS only) also works instead of a phone.

### 2. Get the code

```bash
git clone https://github.com/VITPC/campus-companion.git
cd campus-companion
git checkout dev
```

### 3. Install dependencies

```bash
bun install
```

When you need to add a new package, use `bunx expo install <package>` (not `bun add`), so Expo picks a version that works with our SDK.

### 4. Run the app

```bash
bunx expo start
```

- **Phone:** scan the QR code with your camera (iOS) or the Expo Go app (Android). Your phone and computer must be on the same Wi-Fi.
- **Emulator:** press `a` for Android or `i` for iOS in the terminal.
- If the phone can't connect (school or office Wi-Fi often blocks it), try `bunx expo start --tunnel`.

### 5. Check your code before pushing

```bash
bunx tsc --noEmit             # typecheck
bunx @biomejs/biome check .   # lint and format check
```

Both must pass with no errors before you open a pull request.

---

## Project structure

```
app/                  Screens (Expo Router: every file here is a route)
  _layout.tsx         Root layout: loads fonts
  (tabs)/             Bottom tabs: home, courses, profile
components/ui/        Shared UI components (Screen, Text, ...)
constants/theme.ts    Design tokens: colours, typography, spacing, radius
hooks/                Shared hooks (useTheme, ...)
design/               Screen designs (PNG) and token reference
mocks/data.json       Mock data for every screen (use it until we have an API)
.github/issues/       Source text of the GitHub issues
scripts/              Helper scripts (create-issues.sh)
```

---

## Contributing

### Branches

| Branch | Purpose |
|---|---|
| `main` | Stable code. **Never open a pull request to `main`.** |
| `dev` | Where all student work is merged. **All pull requests go to `dev`.** |

### Workflow

1. **Pick an issue** on GitHub and comment on it so others know you're working on it.
2. **Update `dev`** and create your branch from it:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/<your-name>/<short-task>
   # example: git checkout -b feature/ngwa/course-list
   ```
3. **Build the task.** Match the screen in `design/screens/` and use tokens from `constants/theme.ts`.
4. **Commit** small, clear steps:
   ```bash
   git add .
   git commit -m "feat(courses): add course list with search"
   ```
5. **Check** that the typecheck and lint both pass (see step 5 of Setup).
6. **Push** your branch:
   ```bash
   git push -u origin feature/<your-name>/<short-task>
   ```
7. **Open a pull request** on GitHub following the rules below.

### Pull request rules

- **Base branch must be `dev`.** On the "Open a pull request" page, change **base** from `main` to `dev` before creating it. PRs to `main` will be closed.
- **Title format:**
  ```
  feature/<student-name>: <description of task>
  ```
  Examples:
  - `feature/ngwa: build course list screen with search`
  - `feature/brenda: add language picker to profile`
- **Tag the issue you are resolving** in the description, e.g. `Resolves #12`. This links the PR to the issue.
  Note: because PRs go to `dev` and not `main`, GitHub won't close the issue automatically when the PR is merged. Your lecturer closes it after review.
- **Add screenshots** of your screen running on a phone or emulator, next to the design it should match.
- Keep each PR to **one issue**.

The pull request template fills in these sections for you.

### If your PR needs changes

Push more commits to the same branch. The PR updates by itself; don't open a new one.

If `dev` has moved on since you branched, update your branch:

```bash
git checkout dev
git pull origin dev
git checkout feature/<your-name>/<short-task>
git merge dev
# fix any conflicts, then commit and push
```

---

## License

See [LICENSE](LICENSE).
