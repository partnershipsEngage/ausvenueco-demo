import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brabham Venue Sports",
  description: "Sports, trivia and venue engagement demo for Brabham Hotel."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
