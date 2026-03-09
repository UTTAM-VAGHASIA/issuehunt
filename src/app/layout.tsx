import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "IssueHunt — Find issues worth your time",
  description:
    "Hunt open source GitHub issues matched to your skills. Stop searching. Start contributing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
