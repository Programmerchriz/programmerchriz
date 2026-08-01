import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiExternalLink,
  FiGithub,
  FiLayers,
} from "react-icons/fi";

import ProjectGallery from "@/components/Projects/ProjectGallery";
import { getProjectBySlug, projects } from "@/lib/data/projects";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const generateStaticParams = () => {
  return projects.map((project) => ({
    slug: project.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Christian Nwachukwu",
    };
  }

  return {
    title: `${project.title} | Christian Nwachukwu`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | Christian Nwachukwu`,
      description: project.shortDescription,
      images: [
        {
          url: project.images[0],
          alt: project.title,
        },
      ],
    },
  };
};

const ProjectDetailPage = async ({
  params,
}: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const frontendGithubUrl = project.githubUrl[0];
  const backendGithubUrl = project.githubUrl[1];

  return (
    <main className="relative min-h-screen overflow-hidden pb-24 pt-[16vh] text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-900/20 blur-[140px]" />

      <div className="mx-auto w-[90%] max-w-6xl">
        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-cyan-200"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <section className="mb-12">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            {project.shortDescription}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-800 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-950/40 md:col-span-2 lg:col-span-1"
            >
              <FiExternalLink className="h-5 w-5" />
              View live project
            </a>

            <a
              href={frontendGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/50 hover:bg-cyan-200/10 hover:text-cyan-200"
            >
              <FiGithub className="h-5 w-5" />
              Frontend repository
            </a>

            {backendGithubUrl && (
              <a
                href={backendGithubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/50 hover:bg-cyan-200/10 hover:text-cyan-200"
              >
                <FiGithub className="h-5 w-5" />
                Backend repository
              </a>
            )}
          </div>
        </section>

        <section className="mb-20">
          <ProjectGallery
            images={project.images}
            title={project.title}
          />
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-xl shadow-black/10 sm:p-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Project overview
              </p>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                About the project
              </h2>

              <p className="mt-5 leading-8 text-gray-400">
                {project.description}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-xl shadow-black/10 sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-200/10 text-cyan-200">
                  <FiCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-medium text-cyan-200">
                    Core functionality
                  </p>

                  <h2 className="text-2xl font-bold text-white">
                    Project features
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-blue-950/20 p-4"
                  >
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-200/10 text-cyan-200">
                      <FiCheck className="h-3 w-3" />
                    </div>

                    <p className="text-sm leading-6 text-gray-300">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-xl shadow-black/10 sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-800/30 text-cyan-200">
                  <FiLayers className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-medium text-cyan-200">
                    Engineering approach
                  </p>

                  <h2 className="text-2xl font-bold text-white">
                    Architectural decisions
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {project.architecturalDecisions.map(
                  (decision, index) => (
                    <article
                      key={decision.title}
                      className="rounded-xl border border-white/5 bg-blue-950/20 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-sm font-bold text-white">
                          {index + 1}
                        </span>

                        <div>
                          <h3 className="font-semibold text-white">
                            {decision.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-400">
                            {decision.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-xl shadow-black/10 lg:sticky lg:top-[15vh]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Technologies
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Project stack
            </h2>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-blue-800/50 bg-blue-900/30 px-3 py-2 text-sm text-gray-200"
                >
                  {technology}
                </span>
              ))}
            </div>

            <div className="my-7 h-px bg-white/10" />

            <div className="space-y-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-xl bg-blue-800 px-5 py-3.5 font-medium text-white transition-colors hover:bg-blue-900"
              >
                Live application
                <FiExternalLink className="h-4 w-4" />
              </a>

              <a
                href={frontendGithubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-medium text-white transition-colors hover:border-cyan-200/40 hover:text-cyan-200"
              >
                Frontend source code
                <FiGithub className="h-4 w-4" />
              </a>

              {backendGithubUrl && (
                <a
                  href={backendGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-medium text-white transition-colors hover:border-cyan-200/40 hover:text-cyan-200"
                >
                  Backend source code
                  <FiGithub className="h-4 w-4" />
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetailPage;