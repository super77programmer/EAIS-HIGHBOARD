import {appearanceBootstrap} from '@/lib/appearance';
import {ConnectionStatus} from '@/components/ConnectionStatus';
import type { Metadata } from "next";
import "./light.css";
import "./community.css";
import "./home.css";
import "./usability.css";
import "./core-release.css";
import "./workspace.css";
import "./trips.css";
import "./warm-utilities.css";
import "./motion.css";
import "./experience.css";
import "./completion.css";
import "./school-life.css";
import "./messaging.css";
import "./calendar.css";
import "./desktop.css";
import "./refinements.css";
import "./premium.css";
import "./welcome.css";
import "./dark-theme.css";

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
    <html lang="en" suppressHydrationWarning>
      <head><meta name="theme-color" content="#f8fafc"/><script dangerouslySetInnerHTML={{__html:appearanceBootstrap}}/></head>
      <body className="antialiased"><ConnectionStatus/>{children}</body>
    </html>
  );
}
