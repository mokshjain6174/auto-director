'use client';

import { useEffect, useState } from 'react';

type Shot = {
  shot_number?: number;
  framing?: string;
  description?: string;
  image_prompt?: string;
};

type Scene = {
  scene_number?: number;
  scene_title?: string;
  shots?: Shot[];
};

type Act = {
  act_number?: number;
  act_title?: string;
  scenes?: Scene[];
};

type Storyboard = {
  title?: string;
  acts?: Act[];
};

function DashboardLoading() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-925 to-neutral-900 p-6 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.08),_transparent_24%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded-full bg-blue-400/70" />
            <div className="h-8 w-64 rounded-full bg-white/12" />
            <div className="h-4 w-80 max-w-full rounded-full bg-white/8" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Act I', 'Act II', 'Act III'].map((label) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <div className="text-xs uppercase tracking-[0.35em] text-neutral-500">{label}</div>
                <div className="mt-2 h-2 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.35em] text-neutral-500">Pipeline</div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
            </div>
            <div className="space-y-4">
              {[
                'Breaking story into acts',
                'Designing scene progression',
                'Sourcing visual references',
              ].map((step, index) => (
                <div key={step} className="rounded-xl border border-white/8 bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full border text-sm font-semibold ${
                      index === 2
                        ? 'border-blue-400/60 bg-blue-500/20 text-blue-200'
                        : 'border-white/10 bg-white/5 text-neutral-300'
                    } flex items-center justify-center`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-200">{step}</div>
                      <div className="text-xs text-neutral-500">
                        {index === 2 ? 'In progress' : 'Queued'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-neutral-500">Live Storyboard</div>
                <div className="mt-2 h-6 w-56 rounded-full bg-white/10" />
              </div>
              <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                Drafting visual beats
              </div>
            </div>

            {[1, 2].map((scene) => (
              <div key={scene} className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-40 rounded-full bg-white/10" />
                  <div className="h-4 w-24 rounded-full bg-white/5" />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {[1, 2, 3].map((shot) => (
                    <div key={shot} className="overflow-hidden rounded-2xl border border-white/8 bg-neutral-950/80">
                      <div className="aspect-video bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(255,255,255,0.04),rgba(250,204,21,0.12))] animate-pulse" />
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-20 rounded-full bg-blue-500/20" />
                          <div className="h-3 w-16 rounded-full bg-white/8" />
                        </div>
                        <div className="h-4 w-full rounded-full bg-white/8" />
                        <div className="h-4 w-5/6 rounded-full bg-white/6" />
                        <div className="h-3 w-3/4 rounded-full bg-white/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type ImagePayload = {
  imageBase64?: string;
  imageUrl?: string;
  provider?: string;
  photographerName?: string | null;
  photographerUsername?: string | null;
  imagePageUrl?: string | null;
  fallback?: boolean;
};

function ShotImage({ imagePrompt, altText }: { imagePrompt: string; altText: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageMeta, setImageMeta] = useState<ImagePayload | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        setImageMeta(null);

        const res = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt }),
        });

        const data = (await res.json()) as ImagePayload & { error?: string; details?: string };

        if (!res.ok) {
          throw new Error(data.details || data.error || 'Failed to generate image');
        }

        const resolvedImageUrl = data.imageUrl || data.imageBase64;

        if (!resolvedImageUrl) {
          throw new Error('Image API returned no image data');
        }

        setImageUrl(resolvedImageUrl);
        setImageMeta(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load image';
        console.error('Failed to load image', error);
        setErrorMessage(message);
        setImageUrl(null);
        setImageMeta(null);
      } finally {
        setLoading(false);
      }
    };

    if (!imagePrompt?.trim()) {
      setErrorMessage('No image prompt was generated for this shot');
      setImageUrl(null);
      setImageMeta(null);
      setLoading(false);
      return;
    }

    fetchImage();
  }, [imagePrompt]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-neutral-900 flex flex-col items-center justify-center border-b border-neutral-800">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-500 text-sm animate-pulse">Agent 3 sourcing visual reference...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full aspect-video bg-neutral-900 flex flex-col items-center justify-center border-b border-neutral-800 px-6 text-center">
        <p className="text-red-500 font-medium">Failed to load image</p>
        {errorMessage && <p className="text-neutral-500 text-sm mt-2">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={altText} className="w-full h-auto aspect-video object-cover bg-neutral-950" />
      {imageMeta?.provider === 'unsplash' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3 text-xs text-neutral-300">
          <span>Unsplash reference image</span>
          {imageMeta.photographerName && (
            <>
              <span className="mx-2 text-neutral-500">/</span>
              {imageMeta.imagePageUrl ? (
                <a
                  href={imageMeta.imagePageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-neutral-500 underline-offset-2 hover:text-white"
                >
                  Photo by {imageMeta.photographerName}
                </a>
              ) : (
                <span>Photo by {imageMeta.photographerName}</span>
              )}
            </>
          )}
        </div>
      )}
      {imageMeta?.provider === 'placeholder' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3 text-xs text-neutral-300">
          <span>Fallback visual</span>
          <span className="mx-2 text-neutral-500">/</span>
          <span>No close Unsplash match for this shot</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [storyboardData, setStoryboardData] = useState<Storyboard | null>(null);

  const generateStoryboard = async () => {
    if (!prompt) return;

    setLoading(true);
    setStoryboardData(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setStoryboardData(data.storyboard);
      } else {
        alert(`API Error: ${data.details || data.error}`);
      }
    } catch {
      alert('Network error. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl flex flex-col items-center mt-12 mb-12">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">The Auto-Director</h1>
        <p className="text-neutral-400 mb-8 text-lg text-center">Transform a seed idea into a structured cinematic storyboard.</p>

        <div className="w-full flex flex-col sm:flex-row gap-3 shadow-2xl">
          <input
            suppressHydrationWarning
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g., "A futuristic heist in a high-security vault."'
            className="flex-1 p-4 rounded-lg bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg text-white"
          />
          <button
            onClick={generateStoryboard}
            disabled={loading || !prompt}
            className="px-8 py-4 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg font-bold text-lg whitespace-nowrap"
          >
            {loading ? 'Writing Script...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        {loading && (
          <div className="animate-in fade-in duration-500">
            <DashboardLoading />
          </div>
        )}

        {storyboardData && (
          <div className="space-y-16 animate-in fade-in duration-700">
            <div className="text-center border-b border-neutral-800 pb-8">
              <h2 className="text-3xl font-black text-white">{storyboardData.title || 'Untitled Storyboard'}</h2>
            </div>

            {(storyboardData.acts || []).map((act, actIndex) => {
              const actNumber = act.act_number ?? actIndex + 1;
              const actKey = `act-${act.act_number ?? actIndex}`;

              return (
                <div key={actKey} className="space-y-12">
                  <div className="sticky top-0 bg-neutral-950/90 py-4 z-10 border-b border-neutral-800">
                    <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest">
                      Act {actNumber}: {act.act_title || `Act ${actNumber}`}
                    </h2>
                  </div>

                  {(act.scenes || []).map((scene, sceneIndex) => {
                    const sceneNumber = scene.scene_number ?? sceneIndex + 1;
                    const sceneKey = `${actKey}-scene-${scene.scene_number ?? sceneIndex}`;

                    return (
                      <div key={sceneKey} className="pl-0 sm:pl-8 border-l-0 sm:border-l-2 border-neutral-800 space-y-8">
                        <h3 className="text-xl font-semibold text-neutral-200">
                          Scene {sceneNumber}: {scene.scene_title || `Scene ${sceneNumber}`}
                        </h3>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                          {(scene.shots || []).map((shot, shotIndex) => {
                            const shotNumber = shot.shot_number ?? shotIndex + 1;
                            const shotKey = `${sceneKey}-shot-${shot.shot_number ?? shotIndex}`;

                            return (
                              <div key={shotKey} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-xl h-full">
                                <ShotImage
                                  imagePrompt={shot.image_prompt || ''}
                                  altText={shot.description || `Shot ${shotNumber}`}
                                />

                                <div className="p-6 h-full">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-blue-900/50 text-blue-300 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                      {shot.framing || 'Cinematic'}
                                    </span>
                                    <span className="text-neutral-500 text-sm font-medium">Shot {shotNumber}</span>
                                  </div>
                                  <p className="text-neutral-300 leading-relaxed text-lg">
                                    {shot.description || 'No shot description generated.'}
                                  </p>
                                  <p className="text-neutral-600 text-xs mt-4 italic">
                                    Visual search prompt: {shot.image_prompt || 'No image prompt generated.'}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
