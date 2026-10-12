import Image from 'next/image';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import seed from '@/lib/demo/seed.json';
import { COPY, type Lang } from './copy';
import { KitchenPass } from './KitchenPass';
import { Motion } from './Motion';

const REPO = 'https://github.com/hamdiitarek/CampusBites-Website';
const APP_REPO = 'https://github.com/hamdiitarek/campusbites';

type MenuRow = { name: string; nameAr?: string; price: number };
const data = seed as unknown as { collections: Record<string, { role?: string }[]> };
const MENU = (data.collections.menuItems ?? []) as unknown as MenuRow[];
const STATS = [
  data.collections.vendors?.length ?? 0,
  data.collections.orders?.length ?? 0,
  MENU.length,
  data.collections.users?.filter((u) => u.role === 'student').length ?? 0,
];

const ROLE_ACCENT: Record<string, string> = {
  vendor: 'bg-primary text-primary-foreground',
  admin: 'bg-basil text-white',
  'super-admin': 'bg-grill text-white',
};

// Adds the class that hides the hero until GSAP takes over (see globals.css).
const MOTION_FLAG = "document.documentElement.classList.add('motion')";

function Phone({ src, alt, priority, className = '', ...rest }: { src: string; alt: string; priority?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-[42px] bg-grill p-[9px] shadow-[0_40px_70px_-30px_rgba(42,33,27,0.55)] ${className}`} {...rest}>
      <div className="overflow-hidden rounded-[34px] bg-white">
        <Image src={`/app/${src}.jpg`} alt={alt} width={506} height={1100} sizes="300px" priority={priority} className="h-auto w-full" />
      </div>
    </div>
  );
}

export function Landing({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const other: Lang = lang === 'en' ? 'ar' : 'en';
  const demo = (role: string) => `/${lang}/login?demo=${role}`;
  const ticker = MENU.map((m) => ({ name: lang === 'ar' && m.nameAr ? m.nameAr : m.name, price: `${m.price} ${c.pass.currency}` }));

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} className="min-h-screen bg-background text-foreground">
      <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      <Motion>
        {/* ---------------------------------------------------------------- nav */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
            <Link href={`/${lang}`} className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="" width={34} height={34} className="size-8 rounded-lg sm:size-[34px]" />
              <span className="menu-board text-[23px] text-foreground sm:text-[26px]">CampusBites</span>
            </Link>
            <nav className="hidden items-center gap-7 text-[15px] font-medium text-foreground/75 md:flex">
              <a href="#how" className="hover:text-foreground">
                {c.nav.how}
              </a>
              <a href="#vendors" className="hover:text-foreground">
                {c.nav.vendors}
              </a>
              <a href="#roles" className="hover:text-foreground">
                {c.nav.universities}
              </a>
            </nav>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link href={`/${other}`} lang={other} className="rounded-full px-2.5 py-1.5 text-[14px] font-semibold text-foreground/70 hover:bg-secondary hover:text-foreground sm:px-3">
                {c.nav.switch}
              </Link>
              <Link href="#demo" className="rounded-full bg-foreground px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap text-background transition hover:bg-foreground/85 sm:px-4 sm:text-[14px]">
                {c.nav.demo}
              </Link>
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------------- hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-12 pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pt-20">
          <div>
            <p data-hero-fade className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[13px] font-semibold text-foreground/70">
              <span className="size-1.5 rounded-full bg-primary" />
              {c.hero.eyebrow}
            </p>
            <h1 className="menu-board mt-6 mb-0 text-[clamp(3.6rem,10vw,7.4rem)] text-foreground uppercase rtl:normal-case">
              <span data-hero-title className="block">
                {c.hero.title[0]}
              </span>
              <span data-hero-title className="block text-primary">
                {c.hero.title[1]}
              </span>
              <span data-hero-title className="block">
                {c.hero.title[2]}
              </span>
            </h1>
            <p data-hero-fade className="mt-7 max-w-lg text-[18px] leading-relaxed text-foreground/75">
              {c.hero.body}
            </p>
            <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={demo('vendor')}
                className="rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-primary-foreground shadow-[0_10px_24px_-10px_hsl(var(--primary))] transition hover:brightness-105"
              >
                {c.hero.primary} {lang === 'ar' ? '←' : '→'}
              </Link>
              <a href="#how" className="rounded-full border border-foreground/20 px-6 py-3.5 text-[15px] font-semibold hover:border-foreground/50">
                {c.hero.secondary}
              </a>
            </div>
            <p data-hero-fade className="mt-4 font-mono text-[12px] text-muted-foreground">
              {c.hero.demoNote}
            </p>
          </div>
          <div data-hero-fade>
            <KitchenPass lang={lang} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- menu ticker */}
        <div className="overflow-hidden bg-grill py-4 text-white" aria-hidden>
          <div data-ticker className="menu-board flex w-max whitespace-nowrap text-[28px] uppercase rtl:normal-case">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="flex items-center gap-4 pe-10">
                <span>{item.name}</span>
                <span className="text-saffron">{item.price}</span>
                <span className="ps-6 text-primary">✳</span>
              </span>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- student app story (pinned on desktop) */}
        <section id="how" data-story className="scroll-mt-16 bg-card">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:h-screen lg:min-h-[680px] lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-0">
            <div>
              <p className="font-mono text-[12px] tracking-[0.14em] text-primary uppercase rtl:tracking-normal">{c.how.eyebrow}</p>
              <h2 data-split className="menu-board mt-3 mb-0 max-w-2xl text-[clamp(2.4rem,4.6vw,3.8rem)]">
                {c.how.title}
              </h2>
              <div className="mt-10 flex gap-6">
                <div className="relative hidden w-[3px] shrink-0 overflow-hidden rounded-full bg-border lg:block">
                  <span data-story-bar className="absolute inset-0 bg-primary" />
                </div>
                <ol className="space-y-10 lg:space-y-6">
                  {c.how.steps.map(([title, body, shot, alt], i) => (
                    <li key={title} data-story-step className="grid grid-cols-[2.5rem_1fr] gap-x-2">
                      <span className="pt-1.5 font-mono text-[13px] text-muted-foreground tabular-nums">0{i + 1}</span>
                      <div>
                        <h3 className="m-0 text-[22px] font-bold">{title}</h3>
                        <p className="mt-1 max-w-md text-foreground/70">{body}</p>
                        <Phone data-reveal src={shot} alt={alt} className="mt-6 w-[230px] lg:hidden" />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <figure className="hidden lg:block">
              <div data-story-phone className="relative mx-auto w-[290px]">
                {c.how.steps.map(([, , shot, alt], i) => (
                  <div key={shot} data-story-shot className={i === 0 ? 'relative' : 'absolute inset-0'} style={{ zIndex: c.how.steps.length - i }}>
                    <Phone src={shot} alt={alt} priority={i === 0} />
                  </div>
                ))}
              </div>
              <figcaption className="mt-5 text-center text-[13px] text-muted-foreground">
                {c.how.caption}{' '}
                <a href={APP_REPO} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  GitHub
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------------------------------------------------------- vendor app fan */}
        <section id="vendors" className="scroll-mt-16 overflow-hidden border-y border-border">
          <div className="mx-auto max-w-2xl px-5 pt-20 text-center">
            <p className="font-mono text-[12px] tracking-[0.14em] text-primary uppercase rtl:tracking-normal">{c.vendorApp.eyebrow}</p>
            <h2 data-split className="menu-board mt-3 mb-0 text-[clamp(2.4rem,5.5vw,4.2rem)]">
              {c.vendorApp.title}
            </h2>
            <p data-reveal className="mx-auto mt-5 max-w-xl text-foreground/70">
              {c.vendorApp.body}
            </p>
          </div>
          <div
            data-fan
            className="no-scrollbar relative mx-auto mt-12 flex max-w-6xl snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-16 md:block md:h-[720px] md:overflow-visible md:pb-0"
          >
            {c.vendorApp.shots.map(([src, label, alt], i) => (
              <figure
                key={src}
                data-fan-phone
                className={[
                  'm-0 w-[230px] shrink-0 snap-center md:absolute md:top-0 md:left-[calc(50%-135px)] md:w-[270px]',
                  i === 1 ? 'md:z-10' : '',
                  // Without motion, show the fan already open.
                  i === 0 ? 'md:motion-reduce:-translate-x-[280px] md:motion-reduce:-rotate-6' : '',
                  i === 2 ? 'md:motion-reduce:translate-x-[280px] md:motion-reduce:rotate-6' : '',
                ].join(' ')}
              >
                <Phone src={src} alt={alt} />
                <figcaption className="mt-3 text-center text-[13px] font-semibold text-foreground/70">{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- roles */}
        <section id="roles" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <p className="font-mono text-[12px] tracking-[0.14em] text-primary uppercase rtl:tracking-normal">{c.roles.eyebrow}</p>
          <h2 data-split className="menu-board mt-3 mb-0 max-w-3xl text-[clamp(2.4rem,5.5vw,4.2rem)]">
            {c.roles.title}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {c.roles.items.map((r) => (
              <article key={r.key} data-reveal className="flex flex-col rounded-2xl border border-border bg-card p-7">
                <span className={`w-fit rounded-full px-3 py-1 text-[12px] font-bold ${ROLE_ACCENT[r.key]}`}>{r.title}</span>
                <p className="mt-5 flex-1 text-foreground/75">{r.body}</p>
                <Link
                  href={demo(r.key)}
                  className="mt-7 inline-flex w-fit items-center gap-2 border-b-2 border-foreground pb-0.5 text-[15px] font-bold hover:border-primary hover:text-primary"
                >
                  {r.cta} {lang === 'ar' ? '←' : '→'}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- demo */}
        <section id="demo" className="scroll-mt-20 bg-grill text-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="font-mono text-[12px] tracking-[0.14em] text-saffron uppercase rtl:tracking-normal">{c.demo.eyebrow}</p>
              <h2 data-split className="menu-board mt-3 mb-0 text-[clamp(2.4rem,5.5vw,4.2rem)] text-white">
                {c.demo.title}
              </h2>
              <p data-reveal className="mt-6 max-w-lg text-white/75">
                {c.demo.body}
              </p>
              <div data-reveal className="mt-8 flex flex-wrap gap-3">
                {c.roles.items.map((r) => (
                  <Link
                    key={r.key}
                    href={demo(r.key)}
                    className="rounded-full border border-white/25 px-5 py-2.5 text-[14px] font-semibold transition hover:border-white hover:bg-white hover:text-grill"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px self-center overflow-hidden rounded-2xl bg-white/15">
              {STATS.map((n, i) => (
                <div key={c.demo.stats[i]} className="flex flex-col bg-grill p-5 sm:p-6">
                  <dt className="order-2 mt-1 text-[14px] text-white/60">{c.demo.stats[i]}</dt>
                  <dd data-count={n} className="menu-board m-0 text-[44px] leading-none text-white tabular-nums sm:text-[56px]">
                    {n}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------------------- built + footer */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div data-reveal className="grid gap-6 rounded-2xl border border-dashed border-foreground/25 p-7 md:grid-cols-[auto_1fr_auto] md:items-center">
            <h2 className="m-0 text-[20px] font-bold">{c.built.title}</h2>
            <p className="text-foreground/70">{c.built.body}</p>
            <a href={REPO} target="_blank" rel="noreferrer" className="w-fit rounded-full border border-foreground/25 px-4 py-2 text-[14px] font-semibold hover:border-foreground">
              {c.built.source}
            </a>
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[14px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="menu-board text-[20px] text-foreground">CampusBites</span> · {c.footer.made}
            </span>
            <span className="flex gap-5">
              <Link href={`/${lang}/login`} className="hover:text-foreground">
                {c.nav.signIn}
              </Link>
              <Link href="/campus-food-guide-egypt" className="hover:text-foreground">
                {c.footer.guide}
              </Link>
            </span>
          </div>
        </footer>
      </Motion>
    </div>
  );
}
