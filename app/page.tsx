export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">StreamHelper</h1>
        <p className="text-zinc-400">Piano Streaming Overlay System</p>
        <div className="flex gap-4 mt-4">
          <a href="/dashboard" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Dashboard
          </a>
          <a href="/overlay" className="px-6 py-3 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors">
            Overlay Preview
          </a>
        </div>
      </main>
    </div>
  );
}
