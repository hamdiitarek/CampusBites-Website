import type { Metadata } from 'next';
import { NotFoundView } from '@/components/site/NotFoundView';

export const metadata: Metadata = {
  title: { absolute: '404 · CampusBites' },
  robots: { index: false },
};

// Hides the page until GSAP plays the intro (see globals.css); without JS
// the flag is never set and the page shows as-is.
const MOTION_FLAG = "document.documentElement.classList.add('motion')";

export default function NotFound() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      <NotFoundView />
    </>
  );
}
