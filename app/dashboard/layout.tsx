import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StreamHelper — Dashboard",
  description: "Streaming control dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight">StreamHelper</span>
        <span className="text-xs text-zinc-500">Dashboard</span>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
