# Event Boundary Recall & Memory Formation Prototype

An experimental web application testing the impact of event boundaries (pause durations, visual fixation crosses, context cues) on video recall and memory formation in short-form vertical feed environments (e.g., TikTok/Reels style).

## Features

- **Mobile-First TikTok-Style Video Feed**: Vertical scrolling, play/pause, volume control, progress tracking, and fallback video visualizers.
- **Event Boundary Control Engine**:
  - Customizable pause durations (0s to 10s).
  - Multiple boundary visual stimulus types: `none` (instant transition), `fixation` (fixation cross), `black` (silent black screen), `visual_cue` (segment context transition), and `custom_text`.
  - Flow controls: Auto-advance feed vs. participant manual swipe.
- **Condition Presets & Shareable Links**: Select pre-configured research conditions or fine-tune parameters into shareable URL parameters (e.g., `?pause=3&boundary=fixation&autoAdvance=true`).
- **Memory Assessment & Researcher Export**: Post-viewing recall quizzes with instant score calculation and downloadable JSON/CSV trial logs.

---

## Cloudflare Pages Deployment & GitHub Integration

This project is configured for automated preview deployments on Cloudflare Pages via GitHub Actions.

### Setting up Cloudflare Pages Previews on GitHub:

1. **Create Cloudflare Pages Project**:
   - Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
   - Create a new Pages project named `event-boundary-experiment`.

2. **Add GitHub Repository Secrets**:
   - In your GitHub Repository, navigate to **Settings -> Secrets and variables -> Actions**.
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with **Cloudflare Pages: Edit** permissions.
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found in dashboard URL or API section).

3. **Automatic PR Previews**:
   - Every Pull Request or commit pushed to GitHub automatically triggers `.github/workflows/deploy-cloudflare.yml`.
   - Cloudflare Pages generates a unique preview URL for each pull request.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run production build
npm run build
```
