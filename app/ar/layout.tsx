import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: "%s | كامبوس بايتس - توصيل الطعام الجامعي",
    default: "كامبوس بايتس - تطبيق توصيل الطعام الجامعي"
  },
};

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
