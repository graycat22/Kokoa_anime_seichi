import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_JP({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Antuor",
  description: "アニメの聖地巡礼へようこそ。",
  icons: {
    icon: ["/favicon.ico?v=4"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" data-theme="retro">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
