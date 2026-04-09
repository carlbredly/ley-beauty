import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEY Beauty — Luxury Braiding Salon in Okinawa",
  description:
    "Handcrafted braids, natural care, and a sanctuary of beauty in Okinawa, Japan. Book your appointment at LEY Beauty.",
  keywords: ["braiding salon", "Okinawa", "luxury beauty", "box braids", "knotless braids", "Japan"],
  openGraph: {
    title: "LEY Beauty — Luxury Braiding Salon in Okinawa",
    description: "Handcrafted braids. Natural care. A sanctuary in Okinawa.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "LEY Beauty — Luxury Braiding Salon in Okinawa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEY Beauty — Luxury Braiding Salon in Okinawa",
    description: "Handcrafted braids. Natural care. A sanctuary in Okinawa.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-obsidian text-sand font-body antialiased transition-colors duration-500">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
