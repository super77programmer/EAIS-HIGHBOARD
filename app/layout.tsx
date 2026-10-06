import type { Metadata } from "next";
import "./light.css";
import "./community.css";
import "./home.css";
import "./messaging.css";
import "./usability.css";

export const metadata: Metadata = {
  title: "EAIS High Board | Student Life",
  description: "The EAIS New Cairo student experience. Your events, school schedules, trips and student voice.",
  other: {
    "codex-preview": "development",
  },
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
