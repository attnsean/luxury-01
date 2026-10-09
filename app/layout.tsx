import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "The Wedding of Putri & Andika | Luxury 01",
  description: "Undangan Pernikahan Online Putri Cantika Sari & Putra Andika Pratama",
  openGraph: {
    title: "The Wedding of Putri & Andika",
    description: "Undangan Pernikahan Online Putri & Andika",
    images: [{ url: "/images/thumbnail.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased selection:bg-[#c2a676]/30">
        <div className="min-h-screen w-full flex justify-center items-center bg-[#1c1a19] sm:py-6">
          {/* Mobile frame container matching the.invisimple.id/l01 (max-width: 450px) */}
          <main className="w-full max-w-[450px] min-h-screen bg-[#FAF8F5] relative shadow-2xl overflow-x-hidden border-x border-[#33312f]/40 sm:rounded-2xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
