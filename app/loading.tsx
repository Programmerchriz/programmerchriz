const Loading = () => {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center bg-page px-5 text-ink">
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-900/50" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-200" />

          <div className="absolute inset-[10px] animate-pulse rounded-full bg-accent-soft" />
        </div>

        <p className="mt-6 text-sm font-medium tracking-wide text-muted">
          Loading page...
        </p>
      </div>
    </main>
  );
};

export default Loading;
