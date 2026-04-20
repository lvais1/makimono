// components/shared/BgBlobs.tsx
// Drop inside your root layout — renders three slow-moving gradient orbs
// that bring the Obsidian background to life.

export function BgBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
    </div>
  )
}
