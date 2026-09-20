import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "민화 속 다른 곳을 찾아라!",
  description: "만 5세 유아를 위한 민화 관찰·틀린그림찾기 놀이",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
