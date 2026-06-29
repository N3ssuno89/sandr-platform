'use client';

import { useEffect, useRef, useState } from 'react';
import { labelCls } from '@/components/admin/styles';
import { uploadToBucket } from '@/lib/storage/actions';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from '@/lib/storage/limits';

// Mappa gli errori della server action in messaggi leggibili (rosso).
function mapUploadError(e: string): string {
  switch (e) {
    case 'forbidden':
    case 'unauthorized':
      return 'Solo un admin può caricare immagini.';
    case 'not-configured':
      return 'Supabase non configurato in questo ambiente.';
    case 'bucket-not-allowed':
      return 'Bucket non consentito.';
    case 'bad-file':
    case 'empty-file':
      return 'File non valido o vuoto.';
    case 'file-too-large':
      return `File troppo grande (max ${MAX_UPLOAD_MB}MB). Comprimi o ridimensiona l'immagine.`;
    default:
      return `Errore upload: ${e}`;
  }
}

// Upload immagine → Supabase Storage via SERVER ACTION (admin-gated).
// AREA CRITICA (CLAUDE.md): scrittura via service role / sessione admin (0007).
export function ImageUpload({
  label,
  bucket,
  value,
  onUploaded,
  onBusyChange,
  round = false,
}: {
  label: string;
  bucket: 'athlete-photos' | 'federation-logos' | 'video-thumbnails';
  value?: string;
  onUploaded: (url: string) => void;
  // Notifica il form quando un upload è in corso, così può bloccare il salvataggio
  // finché l'URL non è stato propagato (evita di salvare photo_url vuoto).
  onBusyChange?: (busy: boolean) => void;
  round?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantiene l'anteprima allineata al valore esterno (pre-fill in modifica,
  // o reset dopo un salvataggio) quando non è in corso un upload locale.
  useEffect(() => {
    if (!busy) setPreview(value || null);
  }, [value, busy]);

  function setBusyState(b: boolean) {
    setBusy(b);
    onBusyChange?.(b);
  }

  async function handleFile(file: File) {
    setError(null);
    // Guard lato client: oltre il limite il POST verrebbe rifiutato con 500
    // PRIMA di raggiungere la server action. Blocchiamo qui con un messaggio.
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(mapUploadError('file-too-large'));
      return;
    }
    setPreview(URL.createObjectURL(file));
    setBusyState(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', bucket);
      const res = await uploadToBucket(body);
      if (res.ok) {
        console.log('uploaded photo url:', res.data.url);
        setPreview(res.data.url);
        onUploaded(res.data.url);
      } else {
        // Fallimento NON più silenzioso: mostra l'errore reale.
        setError(mapUploadError(res.error));
        setPreview(value || null);
      }
    } catch (e) {
      setError(`Errore upload: ${e instanceof Error ? e.message : 'sconosciuto'}`);
      setPreview(value || null);
    } finally {
      setBusyState(false);
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
      {error ? (
        <p className="mt-2 max-w-[220px] rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
