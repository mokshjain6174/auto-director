import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Auto-Director",
  description: "Transform a seed idea into a structured cinematic storyboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
