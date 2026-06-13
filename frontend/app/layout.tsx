import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "@/components/nexus/web3-provider";
import TanstackQueryProvider from "@/providers/tanstack-query.provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexusTrust — Contextual reputation for AI agents on Pharos",
  description: "Mission-critical trust and reputation layer for the decentralized AI agent economy. Query, verify, and challenge agent reputation before on-chain execution.",
  openGraph: {
    title: "NexusTrust — Contextual reputation for AI agents on Pharos",
    description: "Mission-critical trust and reputation layer for the decentralized AI agent economy. Query, verify, and challenge agent reputation before on-chain execution.",
    type: "website",
    images: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9848ff13-8a21-4437-9096-d5d4d72ec656/id-preview-4f76a702--b23215db-b353-4ed1-af1b-bed47638b7f7.lovable.app-1781137365606.png"
  },
  twitter: {
    card: "summary",
    title: "NexusTrust — Contextual reputation for AI agents on Pharos",
    description: "Mission-critical trust and reputation layer for the decentralized AI agent economy. Query, verify, and challenge agent reputation before on-chain execution.",
    images: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9848ff13-8a21-4437-9096-d5d4d72ec656/id-preview-4f76a702--b23215db-b353-4ed1-af1b-bed47638b7f7.lovable.app-1781137365606.png"
  }
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('nexus-theme')||'dark';var d=t==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches:t==='dark';if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
      </head>
      <body>
        <TanstackQueryProvider>
          <ThemeProvider defaultTheme="dark">
            <Web3Provider>
              {children}
            </Web3Provider>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
