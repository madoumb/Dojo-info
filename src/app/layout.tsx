import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dojo.info — Formations TSSR, TAI, AIS",
  description:
    "Plateforme de formation révolutionnaire pour étudiants en informatique. Cours complets TSSR, TAI, AIS alignés sur Éduscol avec actualités tech en temps réel.",
  keywords: ["BTS SIO", "TSSR", "TAI", "AIS", "formation informatique", "cybersécurité", "réseaux"],
  openGraph: {
    title: "Dojo.info — Formations TSSR, TAI, AIS",
    description: "Formation informatique professionnelle — cours complets, projets pratiques, actualités tech.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="mesh-gradient grid-bg min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
