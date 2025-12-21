import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { InstallPrompt } from "@/components/InstallPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "PolyPredict | Precision Forecasting",
  description: "The premier multi-outcome prediction protocol. Precision data, verifiable outcomes, decentralized intelligence.",
  keywords: ["prediction market", "polypredict", "solana", "forecasting", "data"],
  manifest: "/manifest.json",
  openGraph: {
    title: "PolyPredict | Precision Forecasting",
    description: "Verifiable prediction markets on Solana.",
    url: "https://polypredict.ai",
    siteName: "PolyPredict",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PolyPredict - Precision Forecasting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolyPredict | Precision Forecasting",
    description: "Verifiable prediction markets. Live on Solana.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PolyPredict",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  }
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-black selection:bg-black selection:text-white">
        <Providers>
          <div className="fixed inset-0 bg-white -z-20" />
          <div className="fixed inset-0 dot-grid -z-10" />
          {children}
          <InstallPrompt />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              `,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
