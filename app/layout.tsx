import Providers from "./providers";
import "@/index.css";

export const metadata = {
  title: "CampusBites",
  description: "Connect with your campus community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
