import {
  AtSign,
  BookMarked,
  Cloud,
  FileCheck2,
  Globe,
  Landmark,
  MessageCircle,
  Mic,
  Newspaper,
  Quote,
  Rss,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { DOMAIN_CARDS, type DomainChannel } from '@/data/dashboard';
import { ExportButton } from './common/ExportButton';

const ICONS: Record<DomainChannel['icon'], typeof Newspaper> = {
  news: Newspaper,
  blog: Rss,
  wiki: Globe,
  twitter: AtSign,
  bluesky: Cloud,
  facebook: Users,
  reddit: MessageCircle,
  podcast: Mic,
  guidelines: ShieldCheck,
  policy: Landmark,
  patents: FileCheck2,
  citations: Quote,
  mendeley: BookMarked,
};

function cardTotal(card: (typeof DOMAIN_CARDS)[number]): number {
  return card.total ?? card.channels.reduce((sum, c) => sum + c.value, 0);
}

export function DomainCards() {
  const grandTotal = DOMAIN_CARDS.reduce((sum, c) => sum + cardTotal(c), 0);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-[var(--color-foreground)]">Total mentions across domains (mean)</h2>
        <ExportButton />
      </div>

      {/* Combined distribution bar */}
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full">
        {DOMAIN_CARDS.map((card) => (
          <div key={card.key} style={{ width: `${(cardTotal(card) / grandTotal) * 100}%`, backgroundColor: card.color }} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DOMAIN_CARDS.map((card) => {
          const maxChannel = Math.max(...card.channels.map((c) => c.value));
          return (
            <div
              key={card.key}
              className="rounded-xl border border-[var(--color-border)] bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: card.color }} />
                  <h3 className="font-heading text-sm font-bold text-[var(--color-foreground)]">{card.label}</h3>
                </div>
                <span className="font-heading text-xl font-extrabold text-[var(--color-foreground)]">{cardTotal(card).toLocaleString()}</span>
              </div>

              <div className="mt-3 flex flex-col gap-2.5">
                {card.channels.map((channel) => {
                  const Icon = ICONS[channel.icon];
                  return (
                    <div key={channel.label} className="flex items-center gap-2 text-sm">
                      <Icon className="size-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
                      <span className="w-[84px] shrink-0 truncate text-[var(--color-foreground)]">{channel.label}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(channel.value / maxChannel) * 100}%`, backgroundColor: card.color }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right font-semibold tabular-nums text-[var(--color-foreground)]">
                        {channel.value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
