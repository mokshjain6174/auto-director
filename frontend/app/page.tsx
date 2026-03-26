'use client';

import { useEffect, useMemo, useState } from 'react';

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

type ImagePayload = {
  imageBase64?: string;
  imageUrl?: string;
  provider?: string;
  photographerName?: string | null;
  photographerUsername?: string | null;
  imagePageUrl?: string | null;
  fallback?: boolean;
};

const workflowPoints = [
  {
    label: 'Story Breakdown',
    title: 'We turn a rough idea into acts, scenes, and shots.',
    copy: 'The app structures the concept first so the visual plan feels intentional instead of random.',
  },
  {
    label: 'Visual Direction',
    title: 'We assign framing and cinematic intent to each moment.',
    copy: 'Each shot gets a camera feel and description so you can quickly judge rhythm, scale, and tone.',
  },
  {
    label: 'Reference Search',
    title: 'We pull or generate visual references for every beat.',
    copy: 'That gives you a fast storyboard-style surface you can review before moving to production.',
  },
];

const quickNotes = [
  'Good for short films, ads, music videos, and concept trailers.',
  'Useful when you need structure before a full script or shot list exists.',
  'Designed to help directors and creators iterate on visual beats quickly.',
];

function DashboardLoading() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(17,24,39,0.95),rgba(15,23,42,0.9),rgba(67,20,7,0.72))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_24%),radial-gradient(circle_at_85%_20%,_rgba(56,189,248,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.14),_transparent_20%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded-full bg-amber-300/80" />
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
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                      index === 2
                        ? 'border-sky-400/60 bg-sky-500/20 text-sky-100'
                        : 'border-white/10 bg-white/5 text-neutral-300'
                    }`}>
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
              <div className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-100">
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
                      <div className="aspect-video animate-pulse bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(255,255,255,0.04),rgba(251,191,36,0.18))]" />
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-20 rounded-full bg-sky-500/20" />
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
      <div className="flex aspect-video w-full flex-col items-center justify-center border-b border-white/10 bg-neutral-950/90">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
        <p className="text-sm text-neutral-400 animate-pulse">Agent 3 sourcing visual reference...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center border-b border-white/10 bg-neutral-950 px-6 text-center">
        <p className="font-medium text-rose-400">Failed to load image</p>
        {errorMessage && <p className="mt-2 text-sm text-neutral-500">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={altText} className="aspect-video h-auto w-full object-cover bg-neutral-950" />
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

  const storyboardStats = useMemo(() => {
    const acts = storyboardData?.acts ?? [];
    const sceneCount = acts.reduce((total, act) => total + (act.scenes?.length ?? 0), 0);
    const shotCount = acts.reduce(
      (total, act) =>
        total +
        (act.scenes ?? []).reduce((sceneTotal, scene) => sceneTotal + (scene.shots?.length ?? 0), 0),
      0,
    );

    return {
      actCount: acts.length,
      sceneCount,
      shotCount,
    };
  }, [storyboardData]);

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
    <main className="relative min-h-screen overflow-hidden bg-[#08111f] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_20%_30%,_rgba(251,191,36,0.12),transparent_24%),radial-gradient(circle_at_80%_15%,_rgba(244,63,94,0.12),transparent_18%)]" />
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-20 right-[-6rem] h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pt-8">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.35em] text-neutral-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.95)]" />
              Visual story machine
            </div>

            <div className="max-w-4xl space-y-5">
              <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                The Auto-Director turns a one-line idea into a cinematic game plan.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Drop in a concept, and we build a structured storyboard with acts, scenes, shot framing, and visual references you can review right away.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {workflowPoints.map((item, index) => (
                <article
                  key={item.label}
                  className="group rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-sky-200/80">{item.label}</span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-neutral-400">0{index + 1}</span>
                  </div>
                  <h2 className="text-lg font-semibold leading-6 text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
                </article>
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <label htmlFor="prompt" className="mb-3 block text-xs uppercase tracking-[0.35em] text-neutral-400">
                    Story Seed
                  </label>
                  <input
                    id="prompt"
                    suppressHydrationWarning
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='e.g., "A futuristic heist in a high-security vault."'
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-lg text-white outline-none transition placeholder:text-neutral-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/20"
                  />
                </div>
                <button
                  onClick={generateStoryboard}
                  disabled={loading || !prompt}
                  className="rounded-2xl bg-[linear-gradient(135deg,#f3f4f6,#fbbf24)] px-8 py-4 text-base font-bold text-slate-950 transition hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(251,191,36,0.3)] disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 disabled:shadow-none"
                >
                  {loading ? 'Writing Script...' : 'Generate Storyboard'}
                </button>
              </div>
            </div>
          </div>

          <aside className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[conic-gradient(from_210deg_at_50%_50%,rgba(56,189,248,0.12),rgba(251,191,36,0.18),rgba(244,63,94,0.12),rgba(56,189,248,0.12))] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.92),rgba(10,17,31,0.98))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.15),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.15),_transparent_24%)]" />
              <div className="relative space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">What are we doing in this?</p>
                  <h2 className="mt-3 font-display text-3xl leading-tight text-white">We are building a storyboard-ready visual plan, not just text.</h2>
                </div>

                <div className="space-y-4">
                  {quickNotes.map((note, index) => (
                    <div key={note} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-amber-200 text-sm font-bold text-slate-950">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-300">{note}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Acts</div>
                    <div className="mt-2 text-3xl font-bold text-white">{storyboardStats.actCount || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Scenes</div>
                    <div className="mt-2 text-3xl font-bold text-white">{storyboardStats.sceneCount || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Shots</div>
                    <div className="mt-2 text-3xl font-bold text-white">{storyboardStats.shotCount || '--'}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="w-full">
          {loading && (
            <div className="animate-in fade-in duration-500">
              <DashboardLoading />
            </div>
          )}

          {storyboardData && (
            <div className="space-y-16 animate-in fade-in duration-700">
              <div className="rounded-[2rem] border border-white/10 bg-black/20 px-6 py-8 text-center backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Generated Storyboard</p>
                <h2 className="font-display mt-3 text-4xl text-white sm:text-5xl">
                  {storyboardData.title || 'Untitled Storyboard'}
                </h2>
              </div>

              {(storyboardData.acts || []).map((act, actIndex) => {
                const actNumber = act.act_number ?? actIndex + 1;
                const actKey = `act-${act.act_number ?? actIndex}`;

                return (
                  <div key={actKey} className="space-y-12">
                    <div className="sticky top-0 z-10 border-b border-white/10 bg-[#08111f]/90 py-4 backdrop-blur-xl">
                      <h2 className="text-2xl font-bold uppercase tracking-[0.25em] text-sky-300">
                        Act {actNumber}: {act.act_title || `Act ${actNumber}`}
                      </h2>
                    </div>

                    {(act.scenes || []).map((scene, sceneIndex) => {
                      const sceneNumber = scene.scene_number ?? sceneIndex + 1;
                      const sceneKey = `${actKey}-scene-${scene.scene_number ?? sceneIndex}`;

                      return (
                        <div key={sceneKey} className="space-y-8 border-l-0 border-white/10 pl-0 sm:border-l-2 sm:pl-8">
                          <h3 className="font-display text-2xl text-neutral-100">
                            Scene {sceneNumber}: {scene.scene_title || `Scene ${sceneNumber}`}
                          </h3>

                          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                            {(scene.shots || []).map((shot, shotIndex) => {
                              const shotNumber = shot.shot_number ?? shotIndex + 1;
                              const shotKey = `${sceneKey}-shot-${shot.shot_number ?? shotIndex}`;

                              return (
                                <div
                                  key={shotKey}
                                  className="h-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] shadow-[0_22px_55px_rgba(0,0,0,0.28)]"
                                >
                                  <ShotImage
                                    imagePrompt={shot.image_prompt || ''}
                                    altText={shot.description || `Shot ${shotNumber}`}
                                  />

                                  <div className="h-full p-6">
                                    <div className="mb-3 flex items-center gap-3">
                                      <span className="rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
                                        {shot.framing || 'Cinematic'}
                                      </span>
                                      <span className="text-sm font-medium text-neutral-500">Shot {shotNumber}</span>
                                    </div>
                                    <p className="text-lg leading-relaxed text-neutral-200">
                                      {shot.description || 'No shot description generated.'}
                                    </p>
                                    <p className="mt-4 text-xs italic text-neutral-500">
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
        </section>
      </div>
    </main>
  );
}
