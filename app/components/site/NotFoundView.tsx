'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, useGSAP);

// Line masks clip at the menu-board line-height (0.9), cutting off descenders
// and Arabic marks. Pad each mask and pull it back so nothing moves.
const unclip = (self: SplitText) =>
  self.masks.forEach((m) =>
    gsap.set(m, { paddingTop: '0.1em', paddingBottom: '0.2em', marginTop: '-0.1em', marginBottom: '-0.2em' }),
  );

const COPY = {
  en: {
    eyebrow: 'Order #404',
    title: "This page is 86'd.",
    body: "In kitchen talk, 86 means it's off the menu. The page you ordered doesn't exist, or it moved somewhere else.",
    home: 'Back to CampusBites',
    demo: 'Open the live demo',
    kitchen: 'CampusBites · Kitchen',
    missing: "Not on today's menu",
    total: 'Total',
    stamp: "86'd",
  },
  ar: {
    eyebrow: 'طلب رقم 404',
    title: 'الصفحة دي مش في المنيو.',
    body: 'الصفحة اللي طلبتها مش موجودة، أو اتنقلت لمكان تاني.',
    home: 'ارجع لكامبوس بايتس',
    demo: 'افتح الديمو',
    kitchen: 'كامبوس بايتس · المطبخ',
    missing: 'مش في منيو النهارده',
    total: 'الإجمالي',
    stamp: 'خلصت',
  },
};

/**
 * 404 as a kitchen ticket: a split-flap board spins to 404, the printer prints
 * an order for the missing page, and it gets stamped 86'd (kitchen slang for
 * "off the menu"). Everything plays once; nothing keeps moving afterwards.
 */
export function NotFoundView() {
  const pathname = usePathname() ?? '/';
  const lang = pathname.startsWith('/ar') ? 'ar' : 'en';
  const c = COPY[lang];
  const root = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState('12:52');

  useEffect(() => {
    const now = new Date();
    setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(root.current, { visibility: 'visible' });

        // Split-flap digits: spin through random numbers, then land on 4-0-4.
        q('[data-flap]').forEach((digit, i) => {
          const final = digit.getAttribute('data-flap') ?? '0';
          const tl = gsap.timeline({ delay: 0.15 + i * 0.16 });
          for (let k = 0; k < 9 + i * 4; k++) {
            tl.call(() => {
              digit.textContent = String(Math.floor(Math.random() * 10));
            }).fromTo(digit, { rotationX: -85, opacity: 0.5 }, { rotationX: 0, opacity: 1, duration: 0.055, ease: 'none' });
          }
          tl.call(() => {
            digit.textContent = final;
          }).fromTo(digit, { rotationX: -90 }, { rotationX: 0, duration: 0.6, ease: 'back.out(3)' });
        });

        // Headline words rise out of masked lines; Arabic is split by word only.
        SplitText.create(q('[data-nf-title]'), {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => {
            unclip(self);
            return gsap.from(self.words, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.55 });
          },
        });
        gsap.from(q('[data-nf-fade]'), { autoAlpha: 0, y: 18, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.75 });

        // The printer feeds the ticket out in steps, then the stamp lands.
        const print = gsap.timeline({ delay: 0.9 });
        print
          .to(q('[data-printer-light]'), { backgroundColor: '#f5a824', duration: 0.15, repeat: 5, yoyo: true })
          .from(q('[data-ticket]'), { yPercent: -101, duration: 1.7, ease: 'steps(16)' }, 0.1)
          .from(
            q('[data-stamp]'),
            { scale: 2.6, rotation: -28, autoAlpha: 0, duration: 0.42, ease: 'power4.in', transformOrigin: '50% 50%' },
            '+=0.25',
          )
          .to(q('[data-ticket-wrap]'), { y: 5, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.out' })
          .set(q('[data-printer-light]'), { backgroundColor: '#e3472b' });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      className="nf-root flex min-h-screen flex-col bg-background text-foreground"
    >
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-5">
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={34} height={34} className="size-8 rounded-lg" />
          <span className="menu-board text-[24px]">CampusBites</span>
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-5 pt-6 pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div>
          {/* split-flap board */}
          <div dir="ltr" className="inline-flex gap-2 rounded-[22px] bg-grill p-3 shadow-[0_30px_60px_-30px_rgba(42,33,27,0.6)] sm:gap-3 sm:p-4" aria-label="404">
            {['4', '0', '4'].map((d, i) => (
              <div
                key={i}
                className="relative grid h-[1.18em] w-[0.78em] place-items-center overflow-hidden rounded-xl bg-[#3b2f28] text-[clamp(5.5rem,20vw,9.5rem)] text-white shadow-[inset_0_-10px_20px_rgba(0,0,0,0.25)]"
                style={{ perspective: 500 }}
              >
                <span data-flap={d} className="menu-board block leading-none will-change-transform" aria-hidden>
                  {d}
                </span>
                <span className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-black/45" />
                <span className="pointer-events-none absolute top-1/2 -left-1 size-2 -translate-y-1/2 rounded-full bg-grill" />
                <span className="pointer-events-none absolute top-1/2 -right-1 size-2 -translate-y-1/2 rounded-full bg-grill" />
              </div>
            ))}
          </div>

          <p data-nf-fade className="mt-9 font-mono text-[12px] tracking-[0.14em] text-primary uppercase rtl:tracking-normal">
            {c.eyebrow}
          </p>
          <h1 data-nf-title className="menu-board mt-3 mb-0 max-w-xl text-[clamp(2.8rem,7vw,5.2rem)]">
            {c.title}
          </h1>
          <p data-nf-fade className="mt-5 max-w-md text-[17px] leading-relaxed text-foreground/70">
            {c.body}
          </p>
          <div data-nf-fade className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${lang}`}
              className="rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-primary-foreground shadow-[0_10px_24px_-10px_hsl(var(--primary))] transition hover:brightness-105"
            >
              {c.home} {lang === 'ar' ? '←' : '→'}
            </Link>
            <Link
              href={`/${lang}/login?demo=vendor`}
              className="rounded-full border border-foreground/20 px-6 py-3.5 text-[15px] font-semibold transition hover:border-foreground/50"
            >
              {c.demo}
            </Link>
          </div>
        </div>

        {/* kitchen printer */}
        <div className="mx-auto w-full max-w-[320px]" aria-hidden>
          <div className="relative z-10 flex h-14 items-center justify-between rounded-2xl bg-grill px-5 shadow-[0_18px_30px_-18px_rgba(42,33,27,0.8)]">
            <span className="font-mono text-[11px] tracking-[0.16em] text-white/55 uppercase rtl:tracking-normal">Kitchen pass</span>
            <span data-printer-light className="size-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(227,71,43,0.7)]" />
          </div>
          <div className="relative z-10 mx-4 -mt-1 h-3 rounded-b-lg bg-black/80" />
          <div data-ticket-wrap className="-mt-1.5 overflow-hidden px-7">
            <div data-ticket className="ticket relative bg-[#fffdf8] px-5 pt-5 font-mono text-[13px] leading-relaxed rtl:font-sans shadow-[0_24px_40px_-24px_rgba(42,33,27,0.45)]">
              <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase rtl:tracking-normal">{c.kitchen}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-[22px] font-semibold">#404</span>
                <span className="text-muted-foreground">{time}</span>
              </div>
              <div className="rule-dashed my-3 h-px" />
              <p className="break-all" dir="ltr">
                <span className="font-semibold">1×</span> {pathname}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">{c.missing}</p>
              <div className="rule-dashed my-3 h-px" />
              <div className="flex items-baseline justify-between pb-2">
                <span className="font-semibold">{c.total}</span>
                <span dir="ltr">0 EGP</span>
              </div>
              <span
                data-stamp
                className="absolute end-4 bottom-7 rotate-[-9deg] rounded-md border-[2.5px] border-primary px-3 py-0.5 font-mono text-[26px] rtl:font-sans font-bold tracking-[0.08em] text-primary uppercase opacity-90 rtl:tracking-normal"
              >
                {c.stamp}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
