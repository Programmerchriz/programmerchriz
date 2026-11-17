"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  projectCard,
  slideInFromUp,
  staggerContainer,
} from "@/lib/animations";
import { projects } from "@/lib/data/projects";
import useReducedMotion from "@/components/Helper/useReducedMotion";

interface ProjectCardProps {
  project: (typeof projects)[number];
  index: number;
}

const ProjectCard = ({
  project,
  index,
}: ProjectCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || project.images.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentImageIndex((currentIndex) => {
        return (currentIndex + 1) % project.images.length;
      });
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [project.images.length, reducedMotion]);

  return (
    <motion.article
      custom={index}
      variants={projectCard}
      className="group relative overflow-hidden rounded-xl border border-line bg-surface shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-surface-hover hover:shadow-xl"
    >
      <div className="relative aspect-video overflow-hidden bg-raised">
        <AnimatePresence initial={false}>
          <motion.div
            key={project.images[currentImageIndex]}
            initial={{
              x: "100%",
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: "-100%",
              opacity: 0,
            }}
            transition={{
              x: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.35,
              },
            }}
            className="absolute inset-0"
          >
            <Image
              src={project.images[currentImageIndex]}
              alt={`${project.title} preview ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={index === 0 && currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {project.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {project.images.map((image, imageIndex) => (
              <button
                key={image}
                type="button"
                onClick={() => setCurrentImageIndex(imageIndex)}
                aria-label={`Show ${project.title} image ${imageIndex + 1}`}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                  currentImageIndex === imageIndex
                    ? "w-6 bg-cyan-200"
                    : "w-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-ink">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
          {project.shortDescription}
        </p>

        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center font-medium text-accent transition-colors hover:text-accent-hover"
        >
          View project
          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </motion.article>
  );
};

const Projects = () => {
  return (
    <section
      id="projects"
      className="overflow-hidden px-5 py-20 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={slideInFromUp}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mb-16 text-center text-3xl font-bold text-ink md:text-4xl xl:text-5xl"
        >
          Recent <span className="text-accent">Projects</span>
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
