# The Auto-Director

The Auto-Director turns a short seed idea into a cinematic storyboard with:

- a generated title
- 3 acts
- 3 scenes per act
- 3 shots per scene
- a visual reference for each shot

The frontend is a Next.js app in [`/frontend`](/E:/auto-director/frontend) that uses Gemini for storyboard generation and Unsplash for visual references by default.

Deployment Link:[https://auto-director-1pcs2h7y8-moksh-jains-projects-71607069.vercel.app/](https://auto-director-1pcs2h7y8-moksh-jains-projects-71607069.vercel.app/)
## Why This Project Feels Different

The Auto-Director is not just a text generator.

It is unique because it takes one small idea and turns it into something that already feels like a film planning board:

- it breaks the story into acts, scenes, and shots automatically
- it gives each shot a camera-style framing
- it pairs each shot with a visual reference
- it shows the result in a storyboard-style layout instead of a plain text response

In easy language: you type one idea, and the app helps you see the movie in your head faster.

This makes it useful for:

- filmmakers planning scenes
- creators exploring story ideas
- students learning visual storytelling
- anyone who wants inspiration without starting from a blank page

## What It Does

You enter a prompt like:

```text
A futuristic heist in a high security vault.
```

The app responds with a structured storyboard containing:

- act titles
- scene titles
- shot framing
- shot descriptions
- visual search prompts

Each scene displays its shots together in one row on large screens, so it reads more like a storyboard strip than a stacked document.

## Example Prompts For The Dashboard

You can paste prompts like these directly into the dashboard:

- A futuristic heist in a high security vault.
- A lonely astronaut finds a garden growing inside a broken space station.
- A detective investigates a murder during a citywide blackout.
- A young inventor builds a machine that lets her hear memories.
- A village on the edge of the sea prepares for a storm that comes alive.


Example:

```text
A tired smuggler must deliver a mysterious glowing suitcase across a rainy neon city before sunrise.
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Google Gemini via `@google/genai`
- Unsplash Search API

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

Supported values:

- `unsplash` for photo-based visual references
- any other value falls back to the Hugging Face generation path

`GEMINI_MODEL`
Optional. Defaults to `gemini-2.5-flash`.


## Running Locally

Start the development server:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying On Vercel

This project is ready to deploy on Vercel.

Steps:

1. Push the code to GitHub, GitLab, or Bitbucket.
2. Open Vercel and import the repository.
3. Set the project `Root Directory` to `frontend`.
4. Let Vercel detect the framework as `Next.js`.
5. Add the required environment variables in Vercel:

```env
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
IMAGE_PROVIDER=unsplash
GEMINI_MODEL=gemini-2.5-flash
```

6. Click `Deploy`.
7. After deployment, test storyboard generation and image loading on the live URL.

Important:

- do not use `NEXT_PUBLIC_` for secret API keys
- keep the root directory as `frontend`
- redeploy if you change environment variables

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

