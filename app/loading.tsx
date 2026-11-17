export default function Loading() {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-[65svh] items-center justify-center bg-page px-5 py-20 text-ink">
      <div role="status" aria-live="polite" aria-atomic="true" className="flex flex-col items-center gap-5">
        <div aria-hidden="true" className="h-10 w-10 rounded-full border-2 border-line border-t-accent motion-safe:animate-spin motion-reduce:animate-none" />
        <p className="text-sm text-muted">Loading page…</p>
      </div>
    </main>
  );
}
