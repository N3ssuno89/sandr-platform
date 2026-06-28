'use client';

import { useRef, useState } from 'react';
import { labelCls } from '@/components/admin/styles';

// Upload immagine → Supabase Storage (route /api/storage/upload, admin-gated).
// AREA CRITICA (CLAUDE.md): scrittura via service role server-side.
export function ImageUpload({
  label,
  bucket,
  value,
  onUploaded,
  round = false,
}: {
  label: string;
  bucket: 'athlete-photos' | 'federation-logos' | 'video-thumbnails';
  value?: string;
  onUploaded: (url: string) => void;
  round?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', bucket);
      const res = await fetch('/api/storage/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onUploaded(data.url);
      }
    } catch {
      // demo: anteprima locale resta
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-[#F04E00]/30 bg-[#F04E00]/[0.04] text-center ${
          round ? 'rounded-full' : 'rounded-xl'
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-[10px] text-[#888888]">{busy ? '…' : 'Carica'}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}
