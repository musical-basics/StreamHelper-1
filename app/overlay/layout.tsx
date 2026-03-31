import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StreamHelper — Overlay",
  description: "OBS browser source overlay",
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
