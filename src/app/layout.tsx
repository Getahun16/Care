import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CARES – Circular economy based biorefinery concepts for the Agricultural value chain and Resilient Enhancement of Smallholder livelihoods",
  description:
    "CARES – Circular economy based biorefinery concepts for the Agricultural value chain and Resilient Enhancement of Smallholder livelihoods. A VLIR-UOS funded research project in Ethiopia.",
  icons: {
    icon: [
      { url: "/assets/CARES LOGO.png", type: "image/png" },
    ],
    apple: "/assets/CARES LOGO.png",
    shortcut: "/assets/CARES LOGO.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
