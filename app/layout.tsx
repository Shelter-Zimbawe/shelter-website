import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelter Zimbabwe - Premium Housing Exhibition Stands | Real Estate Stand Solutions",
  description: "Specialized in creating welcoming, professional exhibition stands for housing shows and real estate events. Custom-designed stands that help you showcase properties and connect with buyers.",
  icons: {
    icon: "/icon.jpeg",
    shortcut: "/icon.jpeg",
    apple: "/icon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
