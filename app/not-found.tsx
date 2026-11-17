import Link from "next/link";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <main id="main-content" tabIndex={-1} className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-16 pt-[14vh] text-ink">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft blur-[130px]" />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-8xl font-black tracking-tight text-accent sm:text-9xl">
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold text-ink sm:text-5xl">
          This page could not be found
        </h1>

        <p className="mx-auto mt-5 max-w-lg leading-7 text-muted">
          The page you are looking for may have been moved, deleted, or never
          existed.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-action px-7 py-3.5 font-semibold text-on-action transition-colors hover:bg-action-hover"
          >
            <FiHome className="h-5 w-5" />
            Return home
          </Link>

          <Link
            href="/#projects"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
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
