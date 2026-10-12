'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Line masks clip at the menu-board line-height (0.9), cutting off descenders
// and Arabic marks. Pad each mask and pull it back so nothing moves.
const unclip = (self: SplitText) =>
  self.masks.forEach((m) =>
    gsap.set(m, { paddingTop: '0.1em', paddingBottom: '0.2em', marginTop: '-0.1em', marginBottom: '-0.2em' }),
  );

/**
 * Wires the landing page's scroll effects to data attributes, so the page
 * itself stays a server component:
 *
 *   data-hero-title / data-hero-fade   intro on load
 *   data-split                         heading words rise out of masked lines
 *   data-reveal                        fade-up, batched as they enter
 *   data-count                         number counts up once
 *   data-ticker                        menu band, one direction, nudged by scroll
 *   data-story / -step / -shot / -bar  pinned student-app walkthrough (desktop)
 *   data-fan / data-fan-phone          vendor phones fan out once in view
 *
 * Everything is skipped under prefers-reduced-motion. Text is split into
 * words, never characters, so Arabic letters stay joined.
 */
export function Motion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const rtl = el.closest('[dir]')?.getAttribute('dir') === 'rtl';
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ------------------------------------------------------------ hero
        q('[data-hero-title]').forEach((line, i) => {
          SplitText.create(line, {
            type: 'lines,words',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) => {
              unclip(self);
              return gsap.from(self.words, {
                yPercent: 115,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.08,
                delay: 0.05 + i * 0.12,
              });
            },
          });
        });
        gsap.from(q('[data-hero-fade]'), {
          autoAlpha: 0,
          y: 22,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.09,
          delay: 0.5,
        });
        // Hidden by CSS until now to avoid a flash before hydration.
        gsap.set(q('[data-hero-title], [data-hero-fade]'), { visibility: 'visible' });

        // ------------------------------------------------------------ headings
        q('[data-split]').forEach((heading) => {
          SplitText.create(heading, {
            type: 'lines,words',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) => {
              unclip(self);
              return gsap.from(self.words, {
                yPercent: 110,
                duration: 0.9,
                ease: 'power4.out',
                stagger: 0.045,
                scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
              });
            },
          });
        });

        // ------------------------------------------------------------ reveals
        gsap.set(q('[data-reveal]'), { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(q('[data-reveal]'), {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
        });

        // ------------------------------------------------------------ counters
        q('[data-count]').forEach((node) => {
          const target = Number(node.getAttribute('data-count'));
          const counter = { value: 0 };
          node.textContent = '0';
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: 'power2.out',
            snap: { value: 1 },
            onUpdate: () => {
              node.textContent = String(counter.value);
            },
            scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          });
        });

        // ------------------------------------------------------------ ticker
        q('[data-ticker]').forEach((track) => {
          // One direction only; scrolling just nudges the speed up for a moment.
          const loop = gsap.to(track, { xPercent: rtl ? 50 : -50, duration: 40, ease: 'none', repeat: -1 });
          let settle: gsap.core.Tween | undefined;
          ScrollTrigger.create({
            trigger: track,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              const boost = 1 + gsap.utils.clamp(0, 3, Math.abs(self.getVelocity()) / 600);
              settle?.kill();
              loop.timeScale(boost);
              settle = gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
            },
          });
        });
      });

      // -------------------------------------------------------------- story
      // Desktop only: pin the section and walk the phone through each step.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const section = q('[data-story]')[0];
        if (!section) return;
        const steps = q('[data-story-step]');
        const shots = q('[data-story-shot]');
        const bar = q('[data-story-bar]');

        gsap.set(shots.slice(1), { autoAlpha: 0, yPercent: 6, scale: 0.94 });
        gsap.set(steps.slice(1), { opacity: 0.32 });
        gsap.set(bar, { scaleY: 1 / steps.length, transformOrigin: 'top' });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * (steps.length - 1) * 0.7}`,
            pin: true,
            scrub: 0.7,
            snap: { snapTo: 'labels', duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut' },
            invalidateOnRefresh: true,
          },
        });

        tl.addLabel('step0').to({}, { duration: 0.6 });
        for (let i = 1; i < steps.length; i++) {
          tl.to(steps[i - 1], { opacity: 0.32 })
            .to(steps[i], { opacity: 1 }, '<')
            .to(shots[i - 1], { autoAlpha: 0, yPercent: -5, scale: 0.94 }, '<')
            .to(shots[i], { autoAlpha: 1, yPercent: 0, scale: 1 }, '<')
            .to(bar, { scaleY: (i + 1) / steps.length }, '<')
            .addLabel(`step${i}`)
            .to({}, { duration: 0.6 });
        }
      });

      // -------------------------------------------------------------- fan
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const fan = q('[data-fan]')[0];
        if (!fan) return;
        const [left, middle, right] = q('[data-fan-phone]');
        const spread = () => Math.min(300, window.innerWidth * 0.24);

        // Opens once when it comes into view and stays open (no back-and-forth).
        gsap
          .timeline({
            defaults: { duration: 1.3, ease: 'expo.out' },
            scrollTrigger: { trigger: fan, start: 'top 70%', once: true, invalidateOnRefresh: true },
          })
          .fromTo(left, { x: 0, rotate: 0, y: 40 }, { x: () => -spread(), rotate: -8, y: 36 }, 0)
          .fromTo(right, { x: 0, rotate: 0, y: 40 }, { x: () => spread(), rotate: 8, y: 36 }, 0)
          .fromTo(middle, { y: 60, scale: 0.94 }, { y: 0, scale: 1 }, 0);
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
