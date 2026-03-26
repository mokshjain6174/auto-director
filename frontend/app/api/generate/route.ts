import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type RawShot = {
  shot_number?: number;
  framing?: string;
  description?: string;
  image_prompt?: string;
};

type RawScene = {
  scene_number?: number;
  scene_title?: string;
  shots?: RawShot[];
};

type RawAct = {
  act_number?: number;
  act_title?: string;
  scenes?: RawScene[];
};

type RawStoryboard = {
  title?: string;
  acts?: RawAct[];
};

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function normalizeStoryboard(data: RawStoryboard, seedPrompt: string) {
  const acts = (data.acts || []).slice(0, 3).map((act, actIndex) => {
    const actNumber = act.act_number ?? actIndex + 1;
    const scenes = (act.scenes || []).slice(0, 3).map((scene, sceneIndex) => {
      const sceneNumber = scene.scene_number ?? sceneIndex + 1;
      const shots = (scene.shots || []).slice(0, 3).map((shot, shotIndex) => {
        const shotNumber = shot.shot_number ?? shotIndex + 1;
        const description =
          shot.description ||
          `Cinematic beat for Act ${actNumber}, Scene ${sceneNumber}, Shot ${shotNumber}.`;
        const framing = shot.framing || "medium shot";
        const imagePrompt =
          shot.image_prompt ||
          `${description} ${seedPrompt}. Cinematic lighting, detailed composition, film still, ${framing}.`;

        return {
          shot_number: shotNumber,
          framing,
          description,
          image_prompt: imagePrompt,
        };
      });

      return {
        scene_number: sceneNumber,
        scene_title: scene.scene_title || `Scene ${sceneNumber}`,
        shots,
      };
    });

    return {
      act_number: actNumber,
      act_title: act.act_title || `Act ${actNumber}`,
      scenes,
    };
  });

  return {
    title: data.title || "Untitled Storyboard",
    acts,
  };
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const systemInstruction = `You are an elite Hollywood Auto-Director AI.
Create a cinematic storyboard in STRICT JSON format.

Return ONLY valid JSON matching this exact shape:
{
  "title": "string",
  "acts": [
    {
      "act_number": 1,
      "act_title": "string",
      "scenes": [
        {
          "scene_number": 1,
          "scene_title": "string",
          "shots": [
            {
              "shot_number": 1,
              "framing": "wide shot | medium shot | close-up | aerial shot | over-the-shoulder",
              "description": "what the camera sees in one sentence",
              "image_prompt": "detailed visual generation prompt for an image model"
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Exactly 3 acts.
- Exactly 3 scenes per act.
- Exactly 3 shots per scene.
- Every shot must include shot_number, framing, description, and image_prompt.
- image_prompt must be vivid, visual, and specific enough for text-to-image generation.
- Do not wrap the JSON in markdown fences.
- Do not include any text before or after the JSON.`;

    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: `${systemInstruction}\n\nSeed Idea: ${prompt}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!result.text) {
      throw new Error("Empty response from Gemini");
    }

    const storyboardData = normalizeStoryboard(
      JSON.parse(result.text) as RawStoryboard,
      prompt
    );

    return NextResponse.json({
      status: "success",
      model: GEMINI_MODEL,
      storyboard: storyboardData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate storyboard",
        details: message,
      },
      { status: 500 }
    );
  }
}
