import Link from "next/link";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-16 pt-[14vh] text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/25 blur-[130px]" />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-8xl font-black tracking-tight text-cyan-200 sm:text-9xl">
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold text-white sm:text-5xl">
          This page could not be found
        </h1>

        <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-400">
          The page you are looking for may have been moved, deleted, or never
          existed.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-800 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-blue-900"
          >
            <FiHome className="h-5 w-5" />
            Return home
          </Link>

          <Link
            href="/#projects"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition-colors hover:border-cyan-200/40 hover:text-cyan-200"
          >
            <FiArrowLeft className="h-5 w-5" />
            Browse projects
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
