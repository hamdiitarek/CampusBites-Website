'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import seed from '@/lib/demo/seed.json';
import { COPY, type Lang } from './copy';

type Item = { name: string; nameAr: string; price: number; vendorId: string };
type Vendor = { $id: string; name: string };
type Ticket = {
  id: string;
  code: string;
  vendor: Vendor;
  lines: { item: Item; qty: number }[];
  pay: 'wallet' | 'cash';
  time: string;
  stage: 0 | 1 | 2;
};

const data = seed as unknown as { collections: { vendors: Vendor[]; menuItems: Item[] } };
const VENDORS = data.collections.vendors;
const ITEMS = data.collections.menuItems;

const vendorName = (v: Vendor, lang: Lang) => {
  const [ar, en] = v.name.split(' - ');
  return lang === 'ar' ? ar : en ?? ar;
};

let counter = 0;
function makeTicket(): Ticket {
  const vendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];
  const menu = ITEMS.filter((i) => i.vendorId === vendor.$id);
  const picks = [...menu].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 2));
  counter += 1;
  const code = `${String.fromCharCode(65 + (counter % 26))}${(100 + ((counter * 37) % 900)).toString()}`;
  const now = new Date();
  return {
    id: `${Date.now()}-${counter}`,
    code,
    vendor,
    lines: picks.map((item) => ({ item, qty: 1 + Math.floor(Math.random() * 2) })),
    pay: Math.random() > 0.45 ? 'wallet' : 'cash',
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    stage: 0,
  };
}

/**
 * A miniature kitchen display: tickets arrive in "New", move to "Preparing",
 * then "Ready", then get picked up. Built from the seeded menu, read-only.
 */
export function KitchenPass({ lang }: { lang: Lang }) {
  const t = COPY[lang].pass;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Start with a full pass so the first paint isn't empty.
    const start: Ticket[] = [makeTicket(), makeTicket(), makeTicket(), makeTicket()];
    start[0].stage = 2;
    start[1].stage = 1;
    start[2].stage = 1;
    setTickets(start);
    const id = setInterval(() => {
      setTickets((prev) => {
        // Pick up the oldest ready ticket, advance the oldest in each lane, add a new one.
        const next = prev.map((tk) => ({ ...tk }));
        const ready = next.filter((tk) => tk.stage === 2);
        const prep = next.filter((tk) => tk.stage === 1);
        const fresh = next.filter((tk) => tk.stage === 0);
        const out = new Set<string>();
        if (ready.length) out.add(ready[0].id);
        if (prep.length && ready.length <= 1) prep[0].stage = 2;
        if (fresh.length && prep.length <= 2) fresh[0].stage = 1;
        const kept = next.filter((tk) => !out.has(tk.id));
        if (kept.filter((tk) => tk.stage === 0).length < 2) kept.push(makeTicket());
        return kept;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const lanes = useMemo(() => [0, 1, 2].map((s) => tickets.filter((tk) => tk.stage === s)), [tickets]);

  return (
    <div className="relative">
      <div className="rounded-[22px] bg-grill p-3 shadow-[0_30px_60px_-30px_rgba(42,33,27,0.6)] sm:p-4">
        <div className="mb-3 flex items-center justify-between px-1 font-mono text-[11px] tracking-[0.14em] text-white/60 uppercase rtl:tracking-normal">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-basil opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-basil" />
            </span>
            {lang === 'ar' ? 'لايف' : 'Live'}
          </span>
          <span>EUI · Food court</span>
        </div>
        <LayoutGroup>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {lanes.map((lane, s) => (
              <div key={s} className="min-h-[250px] min-w-0 rounded-[14px] bg-white/[0.06] p-1.5 sm:min-h-[400px] sm:p-2.5">
                <p className="mb-2 flex items-center justify-between px-1 text-[12px] font-semibold text-white/80">
                  {t.columns[s]}
                  <span className="font-mono text-[11px] text-white/45 tabular-nums">{lane.length}</span>
                </p>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {lane.slice(0, 2).map((tk) => (
                      <motion.div
                        key={tk.id}
                        layoutId={tk.id}
                        layout={!reduced.current}
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: lang === 'ar' ? -40 : 40, transition: { duration: 0.35 } }}
                        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                      >
                        <TicketCard ticket={tk} lang={lang} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <p className="mt-3 text-center text-[13px] text-muted-foreground">{t.caption}</p>
    </div>
  );
}

const STAMP = ['text-saffron border-saffron', 'text-primary border-primary', 'text-basil border-basil'];

export function TicketCard({ ticket, lang }: { ticket: Ticket; lang: Lang }) {
  const t = COPY[lang].pass;
  const total = ticket.lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  return (
    <div className="ticket bg-[#fffdf8] px-2 pt-2 text-[11px] leading-snug text-foreground sm:px-3 sm:pt-2.5 sm:text-[12px]">
      <div className="flex items-center justify-between gap-1 font-mono">
        <span className="font-semibold">#{ticket.code}</span>
        <span className="hidden text-muted-foreground sm:inline">{ticket.time}</span>
      </div>
      <p className="mt-0.5 text-[9.5px] leading-tight font-semibold tracking-wide break-words text-muted-foreground uppercase sm:truncate sm:text-[10.5px] rtl:tracking-normal">
        {vendorName(ticket.vendor, lang)}
      </p>
      <div className="my-1.5 border-t border-dashed border-foreground/25" />
      <ul className="space-y-0.5">
        {ticket.lines.map((l) => (
          <li key={l.item.name} className="flex justify-between gap-2">
            <span className="min-w-0 break-words sm:truncate">
              <span className="font-mono">{l.qty}×</span> {lang === 'ar' ? l.item.nameAr : l.item.name}
            </span>
            <span className="hidden shrink-0 font-mono tabular-nums sm:inline">{l.item.price * l.qty}</span>
          </li>
        ))}
      </ul>
      <div className="my-1.5 border-t border-dashed border-foreground/25" />
      <div className="flex items-center justify-between font-mono">
        <span className="font-semibold">
          {total} <span className="text-[10px] font-normal text-muted-foreground">{t.currency}</span>
        </span>
        {/* The lane heading already names the stage; the stamp only fits from sm up. */}
        <span className={`stamp hidden sm:inline-block ${STAMP[ticket.stage]}`}>{t.stamps[ticket.stage]}</span>
      </div>
    </div>
  );
}
