'use client';

import { Link } from '@/i18n/routing';
import { VodCard } from '@/components/cards/VodCard';
import { RemoveContinueButton } from '@/components/sections/RemoveContinueButton';
import type { ContinueItem } from '@/lib/tracking/queries';

// Card "Continua a guardare": VodCard con barra di avanzamento + bottone X
// (in alto a destra, appare all'hover) per rimuoverla dalla riga.
export function ContinueWatchingCard({ item }: { item: ContinueItem }) {
  return (
    <div className="group relative shrink-0 snap-start">
      <Link href={`/vod/${item.id}`} className="block">
        <VodCard
          title={item.title}
          date=""
          duration=""
          access={item.access}
          cardWidth={240}
          thumbnailUrl={item.thumbnail}
          progress={item.progress}
        />
      </Link>
      <RemoveContinueButton
        videoId={item.id}
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  );
}
