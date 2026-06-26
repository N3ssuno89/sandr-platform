'use client';

import { useRef, useState } from 'react';
import { VideoMetadataForm } from '@/components/admin/VideoMetadataForm';

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function UploadVideoPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(f: File) {
    setFile(f);
    setUploading(true);
    setProgress(0);

    // Progresso simulato (l'upload diretto a Cloudflare avviene via uploadURL).
    const timer = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + 10));
    }, 200);

    try {
      // Richiede l'uploadURL al server (token mai esposto al client).
      const res = await fetch('/api/stream/upload-url', { method: 'POST' });
      const data = await res.json();

      if (data.uploadURL) {
        // Upload diretto del file a Cloudflare Stream.
        const body = new FormData();
        body.append('file', f);
        await fetch(data.uploadURL, { method: 'POST', body });
      }

      clearInterval(timer);
      setProgress(100);
      // In demo, anche senza config Cloudflare, si procede allo step metadata.
      setUid(data.uid ?? 'demo-uid');
    } catch {
      clearInterval(timer);
      setProgress(100);
      setUid('demo-uid');
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Carica nuovo video</h1>

      {/* STEP 1 — Upload */}
      {!uid ? (
        <div className="mt-8">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragOver ? 'border-[#F04E00] bg-[#F04E00]/[0.08]' : 'border-[#F04E00]/30 bg-[#F04E00]/[0.04]'
            }`}
          >
            <p className="font-condensed text-xl font-bold uppercase text-white">Trascina il video qui</p>
            <p className="mt-1 text-sm text-[#888888]">o clicca per selezionare</p>
            <p className="mt-3 text-xs text-[#555555]">MP4, MOV, AVI — max 10GB</p>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {file && (
            <div className="mt-4 rounded-xl bg-[#141414] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-white">{file.name}</span>
                <span className="ml-3 shrink-0 text-[#888888]">{fmtSize(file.size)}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-sandr-orange transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#888888]">
                {uploading ? `Caricamento… ${progress}%` : `${progress}%`}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* STEP 2 — Metadata */
        <div className="mt-8">
          <p className="mb-4 text-sm text-emerald-400">Video caricato. Compila i metadata.</p>
          <VideoMetadataForm uid={uid} defaultValues={{ name: file?.name?.replace(/\.[^.]+$/, '') ?? '' }} />
        </div>
      )}
    </div>
  );
}
