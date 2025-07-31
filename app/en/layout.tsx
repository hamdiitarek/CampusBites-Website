import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: "%s | CampusBites - Campus Food Delivery",
    default: "CampusBites - Campus Food Delivery App Egypt"
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="font-inter">
      {children}
    </div>
  );
}
