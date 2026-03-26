import { NextResponse } from "next/server";

const HF_IMAGE_MODEL =
  process.env.HF_IMAGE_MODEL ||
  "stabilityai/stable-diffusion-xl-base-1.0";
const IMAGE_PROVIDER = process.env.IMAGE_PROVIDER || "unsplash";

function buildUnsplashQuery(prompt: string) {
  return prompt
    .replace(/[^\w\s,-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function buildFallbackQueries(prompt: string) {
  const base = buildUnsplashQuery(prompt);
  const compact = base
    .split(",")
    .slice(0, 2)
    .join(" ")
    .split(" ")
    .slice(0, 8)
    .join(" ")
    .trim();

  return Array.from(
    new Set([base, compact, "cinematic scene", "movie still", "dramatic landscape"].filter(Boolean))
  );
}

function buildPlaceholderImage(prompt: string) {
  const safePrompt = prompt.replace(/[<>&"]/g, " ").slice(0, 90);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111827" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1f2937" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)" />
      <rect x="56" y="56" width="1168" height="608" rx="24" fill="none" stroke="#334155" stroke-width="2" />
      <text x="640" y="300" text-anchor="middle" fill="#e2e8f0" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700">
        Visual reference unavailable
      </text>
      <text x="640" y="360" text-anchor="middle" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="28">
        No close Unsplash match for this shot
      </text>
      <text x="640" y="430" text-anchor="middle" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">
        ${safePrompt}
      </text>
    </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (IMAGE_PROVIDER === "unsplash") {
      if (!process.env.UNSPLASH_ACCESS_KEY) {
        return NextResponse.json(
          { error: "UNSPLASH_ACCESS_KEY is missing" },
          { status: 500 }
        );
      }

      const queries = buildFallbackQueries(prompt);

      for (const query of queries) {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query
          )}&per_page=1&orientation=landscape&content_filter=high`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
              "Accept-Version": "v1",
            },
            next: { revalidate: 3600 },
          }
        );

        if (!response.ok) {
          const details = await response.text();
          throw new Error(
            details || `Unsplash API responded with status ${response.status}`
          );
        }

        const payload = await response.json();
        const photo = payload?.results?.[0];

        if (!photo?.urls?.regular) {
          continue;
        }

        return NextResponse.json({
          status: "success",
          provider: "unsplash",
          imageUrl: photo.urls.regular,
          imagePageUrl: photo.links?.html || null,
          photographerName: photo.user?.name || null,
          photographerUsername: photo.user?.username || null,
          query,
        });
      }

      return NextResponse.json({
        status: "success",
        provider: "placeholder",
        imageUrl: buildPlaceholderImage(prompt),
        fallback: true,
      });
    }

    if (!process.env.HF_API_KEY) {
      return NextResponse.json(
        { error: "HF_API_KEY is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${HF_IMAGE_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let details = `Hugging Face API responded with status ${response.status}`;

      if (contentType.includes("application/json")) {
        const errorPayload = await response.json();
        details =
          errorPayload?.error ||
          errorPayload?.message ||
          JSON.stringify(errorPayload);
      } else {
        details = await response.text();
      }

      throw new Error(details);
    }

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      throw new Error(
        payload?.error ||
          payload?.message ||
          "Image API returned JSON instead of an image"
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = contentType || "image/jpeg";
    const base64Image = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      status: "success",
      provider: "huggingface",
      model: HF_IMAGE_MODEL,
      imageBase64: base64Image,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("Stable Diffusion Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: message,
      },
      { status: 500 }
    );
  }
}
