import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "KiteIndex Pro",
  description: "Production-grade Kite Mainnet indexer and API connector status.",
  icons: {
    icon: "/brand/kite-logo-mark-beige.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand">
              <img className="brand-logo" src="/brand/kite-logo-beige.png" alt="Kite" />
              KiteIndex Pro
            </Link>
            <nav className="nav" aria-label="Primary">
              <a href="/api/v1/transfers?api_key=demo">Transfers API</a>
              <a href="/api/v1/usage?api_key=demo">Usage API</a>
              <a href="https://github.com/gnanam1990/kiteindex_pro-app" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
