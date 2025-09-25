import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header, Footer } from "../components/layout";
import { ThemeProvider } from "../components/providers";
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
  title: "EmailService - Your Perfect Email Interface",
  description: "Choose your perfect email interface style. Gmail Classic, Outlook Advanced, Apple Minimal, or Proton Privacy.",
  keywords: ["email", "gmail", "outlook", "apple", "proton", "interface", "privacy", "security"],
  authors: [{ name: "EmailService Team" }],
  creator: "EmailService",
  publisher: "EmailService",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://emailservice.com"),
  openGraph: {
    title: "EmailService - Your Perfect Email Interface",
    description: "Choose your perfect email interface style. Gmail Classic, Outlook Advanced, Apple Minimal, or Proton Privacy.",
    url: "https://emailservice.com",
    siteName: "EmailService",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmailService - Your Perfect Email Interface",
    description: "Choose your perfect email interface style. Gmail Classic, Outlook Advanced, Apple Minimal, or Proton Privacy.",
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
        <ThemeProvider>
          <div className="app-layout">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
