import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Debugger",
  description: "Automatic debugging for your code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-green-50"
      >
        {children}
      </body>
    </html>
  );
}
