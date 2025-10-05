"use client";

import React, { useEffect, useRef, useState } from "react";

const PRESET_CHIPS = [
  "neon astronaut surfing a supernova, cinematic, 8K",
  "glowing space jellyfish above a city, digital art",
  "retro anime spaceship cockpit, cel shading",
  "photorealistic moon base with plants, soft lighting",
];

function encodePrompt(p: string) {
  return encodeURIComponent(p).replace(/%20/g, "+");
}

function buildPollinationsURL(prompt: string) {
  const base = "https://image.pollinations.ai/prompt/";
  const seed = Date.now();
  const width = 768;
  const height = 512;
  return `${base}${encodePrompt(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pageShareUrl, setPageShareUrl] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setPageShareUrl(window.location.href);
    const resolve = async () => {
      try {
        const res = await fetch("/api/hostinfo", { cache: "no-store" });
        if (res.ok) {
          const info = await res.json();
          if (info?.lanUrl) setPageShareUrl(info.lanUrl);
        }
      } catch {}
    };
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      resolve();
    }
  }, []);

  const setLoadingState = (v: boolean) => {
    setLoading(v);
  };

  const generateImage = async () => {
    let full = prompt.trim();
    const s = style.trim();
    if (s) full = full ? `${full}, ${s}` : s;
    if (!full) {
      setStatus("Please enter a prompt or pick a preset.");
      return;
    }

    const url = buildPollinationsURL(full);
    setImageUrl(url);

    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {}
    }
    abortRef.current = new AbortController();

    setLoadingState(true);
    setStatus("Generating image…");
    const timeoutMs = 10000;
    const timeout = setTimeout(() => abortRef.current?.abort(), timeoutMs);
    try {
      const res = await fetch(url, { cache: "reload", signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      setImageUrl(objUrl);
      setStatus("Done!");
      setTimeout(() => {
        imgRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch (e) {
      setStatus("Took too long or failed. Try Retry or tweak the prompt.");
    } finally {
      clearTimeout(timeout);
      setLoadingState(false);
    }
  };

  const retry = () => {
    if (!prompt.trim() && PRESET_CHIPS.length) {
      const rnd = PRESET_CHIPS[Math.floor(Math.random() * PRESET_CHIPS.length)];
      setPrompt(rnd);
    }
    generateImage();
  };

  const downloadCurrent = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "space-art.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6 md:p-10">
      <header className="mb-6 animate-[fadeIn_0.5s_ease-out]">
        {/* title + subtitle switched to black as requested */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">AI Space Control Panel</h1>
        <p className="text-black/85 mt-1">Click. Generate. Share. Perfect for club fairs and live demos.</p>
      </header>

      <section className="ticket-card p-5 sm:p-7 animate-[fadeIn_0.6s_ease-out] bg-white/95">
        <div className="space-y-6">
          {/* Generator */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-900">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px] shadow-emerald-400" />
              AI Image Generator Demo
            </h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your space art..."
                  className="flex-1 min-w-[220px] rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 outline-none placeholder-gray-500 text-gray-900"
                />

                <select
                  aria-label="Choose image style"
                  name="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none text-gray-900 font-medium shadow-sm hover:border-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[position:right_12px_center] bg-no-repeat pr-10 [&>option]:bg-white [&>option]:text-gray-900 [&>option]:py-3 [&>option]:px-4 [&>option]:rounded-lg [&>option:hover]:bg-indigo-50 [&>option:checked]:bg-indigo-100 [&>option:checked]:font-semibold"
                >
                  <option value="" className="py-3 px-4 text-gray-500 bg-white rounded-lg">Select a style...</option>
                  <option value="cinematic, dramatic lighting" className="py-3 px-4 bg-white hover:bg-indigo-50 rounded-lg">Cinematic & Dramatic</option>
                  <option value="digital art, trending on artstation" className="py-3 px-4 bg-white hover:bg-indigo-50 rounded-lg">Digital Art</option>
                  <option value="low-poly 3D, isometric" className="py-3 px-4 bg-white hover:bg-indigo-50 rounded-lg">Low-Poly 3D</option>
                  <option value="retro anime, cel shading" className="py-3 px-4 bg-white hover:bg-indigo-50 rounded-lg">Retro Anime</option>
                  <option value="pixel art, 32-bit" className="py-3 px-4 bg-white hover:bg-indigo-50 rounded-lg">Pixel Art</option>
                  <option value="photorealistic, ultra-detailed" className="py-3 px-4 bg-white hover:bg-indigo-50 rounded-lg">Photorealistic</option>
                </select>

                {/* PRIMARY: purple -> indigo gradient like the asset */}
                <button
                  onClick={generateImage}
                  disabled={loading}
                  className="rounded-xl border border-transparent bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-5 py-2.5 font-bold hover:from-indigo-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Image
                </button>

                <span className={`inline-flex items-center gap-2 text-sm ${loading ? "text-gray-600" : "hidden"}`}>
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
                  Generating (≤10s)…
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_CHIPS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                    title="Use this prompt"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="relative rounded-xl border border-gray-300 bg-gray-100 min-h-[320px] grid place-items-center overflow-hidden">
                {!imageUrl && <div className="text-gray-500">Your image will appear here.</div>}
                {imageUrl && <img ref={imgRef} src={imageUrl} alt="AI generated" className="max-w-full h-auto" />}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* SECONDARY: subtle purple outline / white background */}
                <button
                  onClick={downloadCurrent}
                  className="rounded-xl border border-purple-200 bg-white text-purple-700 px-3 py-2 hover:bg-purple-50 transition"
                >
                  Download
                </button>

                <button
                  onClick={retry}
                  className="rounded-xl border border-purple-200 bg-white text-purple-700 px-3 py-2 hover:bg-purple-50 transition"
                >
                  Retry
                </button>

                <span className="text-gray-600 text-sm">{status}</span>
              </div>
            </div>
          </section>

          
        </div>
      </section>
    </main>
  );
}
