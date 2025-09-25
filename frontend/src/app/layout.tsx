import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header, Footer } from "../components/layout";
import { QueryProvider, AuthProvider } from "../components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jazz Melodic - Where Technique Meets Artistry",
  description: "Learn from the masters, create with the community. Your musical journey, amplified.",
  keywords: ["music", "jazz", "learning", "tutorials", "courses", "videos", "blog"],
  authors: [{ name: "Jazz Melodic Team" }],
  creator: "Jazz Melodic",
  publisher: "Jazz Melodic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jazzmelodic.com"),
  openGraph: {
    title: "Jazz Melodic - Where Technique Meets Artistry",
    description: "Learn from the masters, create with the community. Your musical journey, amplified.",
    url: "https://jazzmelodic.com",
    siteName: "Jazz Melodic",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jazz Melodic - Where Technique Meets Artistry",
    description: "Learn from the masters, create with the community. Your musical journey, amplified.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <div className="app-layout">
              <Header />
              <main className="main-content">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
