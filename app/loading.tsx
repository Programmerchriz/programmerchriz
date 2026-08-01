const Loading = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d1f] px-5 text-white">
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-900/50" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-200" />

          <div className="absolute inset-[10px] animate-pulse rounded-full bg-cyan-200/10" />
        </div>

        <p className="mt-6 text-sm font-medium tracking-wide text-gray-400">
          Loading page...
        </p>
      </div>
    </main>
  );
};

export default Loading;
