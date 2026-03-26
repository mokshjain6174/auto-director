# The Auto-Director

The Auto-Director turns a short seed idea into a cinematic storyboard with:

- a generated title
- 3 acts
- 3 scenes per act
- 3 shots per scene
- a visual reference for each shot

The frontend is a Next.js app in [`/frontend`](/E:/auto-director/frontend) that uses Gemini for storyboard generation and Unsplash for visual references by default.

## What It Does

You enter a prompt like:

```text
A futuristic heist in a high-security vault.
```

The app responds with a structured storyboard containing:

- act titles
- scene titles
- shot framing
- shot descriptions
- visual search prompts

Each scene displays its shots together in one row on large screens, so it reads more like a storyboard strip than a stacked document.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Google Gemini via `@google/genai`
- Unsplash Search API
- Optional Hugging Face image generation fallback/provider mode

## Project Structure

```text
auto-director/
  README.md
  frontend/
    app/
      api/
        generate/route.ts
        image/route.ts
      globals.css
      layout.tsx
      page.tsx
    package.json
```

## Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create `frontend/.env.local` with the required keys:

```env
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
IMAGE_PROVIDER=unsplash
GEMINI_MODEL=gemini-2.5-flash
```

## Environment Variables

`GEMINI_API_KEY`
Required. Used by `/api/generate` to create the storyboard JSON.

`UNSPLASH_ACCESS_KEY`
Required when `IMAGE_PROVIDER=unsplash`. Used by `/api/image` to search reference photos.

`IMAGE_PROVIDER`
Optional. Defaults to `unsplash`.

Supported values:

- `unsplash` for photo-based visual references
- any other value falls back to the Hugging Face generation path

`GEMINI_MODEL`
Optional. Defaults to `gemini-2.5-flash`.

`HF_API_KEY`
Optional unless you intentionally switch away from Unsplash-based images.

`HF_IMAGE_MODEL`
Optional. Defaults to `stabilityai/stable-diffusion-xl-base-1.0`.

## Running Locally

Start the development server:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

From [`/frontend`](/E:/auto-director/frontend):

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## How Image Selection Works

The app currently prefers Unsplash over direct AI image generation.

Flow:

1. Gemini creates the storyboard and an image prompt for each shot.
2. `/api/image` searches Unsplash using that prompt.
3. If no strong match is found, the API retries broader fallback queries.
4. If nothing matches, the app returns a built-in placeholder image instead of failing the storyboard.

This keeps the UI usable even when a very specific shot has no close photo match.

## Current API Routes

`POST /api/generate`

- input: `{ "prompt": "..." }`
- output: storyboard JSON with title, acts, scenes, and shots

`POST /api/image`

- input: `{ "prompt": "..." }`
- output:
  - Unsplash image metadata and URL, or
  - generated image data, or
  - a placeholder fallback image

## Notes

- The storyboard generator normalizes output to a fixed 3 x 3 x 3 structure.
- The UI shows attribution when an Unsplash image is used.
- Missing image matches no longer break the page; they render a fallback visual instead.
- The app uses local/system font stacks, so it does not depend on Google Fonts during build.

## Next Improvements

- add prompt history or saved storyboard sessions
- export storyboard to PDF or shot list
- support multiple image sources with ranking
- add per-shot refresh/regenerate controls
- improve mobile storyboard navigation between scenes and acts
