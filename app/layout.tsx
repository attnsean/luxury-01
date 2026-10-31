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
        {/* Suppress and remove Vercel Toolbar if injected */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var killToolbar = function() {
                    var selectors = ['vercel-toolbar', 'v-toolbar', '#vercel-toolbar', 'vercel-live-feedback', 'iframe[src*="vercel.live"]', 'iframe[title*="Vercel Toolbar"]'];
                    for (var i = 0; i < selectors.length; i++) {
                      var els = document.querySelectorAll(selectors[i]);
                      for (var j = 0; j < els.length; j++) {
                        els[j].remove();
                      }
                    }
                  };
                  killToolbar();
                  if (typeof MutationObserver !== 'undefined') {
                    var observer = new MutationObserver(killToolbar);
                    if (document.body) {
                      observer.observe(document.body, { childList: true, subtree: true });
                    } else {
                      document.addEventListener('DOMContentLoaded', function() {
                        if (document.body) observer.observe(document.body, { childList: true, subtree: true });
                      });
                    }
                    setTimeout(function() { observer.disconnect(); }, 8000);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
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
