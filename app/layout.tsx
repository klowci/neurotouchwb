import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroTouch app",
  description: "NeuroTouch lets people with mobility disabilities navigate their phone hands-free using eye tracking and lip reading. No extra hardware. No voice required.",
  icons: { icon: [{ url: "/logo.jpeg", type: "image/jpeg" }] },
  other: { "format-detection": "telephone=no, date=no, email=no, address=no" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full bg-[#0E1621] text-[#F4F1EC] font-sans">
        {children}
      </body>
    </html>
  );
}
