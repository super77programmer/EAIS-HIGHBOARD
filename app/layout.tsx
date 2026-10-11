import {ConnectionStatus} from '@/components/ConnectionStatus';
import type { Metadata } from "next";
import "./light.css";
import "./community.css";
import "./home.css";
import "./messaging.css";
import "./usability.css";
import "./core-release.css";
import "./workspace.css";
import "./trips.css";
import "./warm-utilities.css";
import "./motion.css";
import "./experience.css";
import "./completion.css";

export const metadata: Metadata = {
  title: "EAIS High Board | Student Life",
  description: "The EAIS New Cairo student experience. Your events, school schedules, trips and student voice.",
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
      <body className="antialiased"><ConnectionStatus/>{children}</body>
    </html>
  );
}
