"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  projectCard,
  slideInFromUp,
  staggerContainer,
} from "@/lib/animations";

interface Project {
  images: string[];
  title: string;
  link: string;
}

const projects: Project[] = [
  {
    images: [
      "/images/career-compass-1.png",
      "/images/career-compass-2.png",
      "/images/career-compass-3.png",
    ],
    title: "Career Guidance App",
    link: "https://careeer-compasss.vercel.app",
  },
  // {
  //   images: [
  //     "/images/p2.png",
  //     "/images/p2-2.png",
  //     "/images/p2-3.png",
  //   ],
  //   title: "Vehicle License Plate Recognition System",
  //   link: "https://vehicle-license-plate.vercel.app",
  // },
  {
    images: [
      "/images/coinglobal-1.png",
      "/images/coinglobal-2.png",
      "/images/coinglobal-3.png",
      "/images/coinglobal-4.png",
    ],
    title: "Cryptocurrency Finance App",
    link: "https://coin-global.vercel.app",
  },
  {
    images: [
      "/images/inventory-1.png",
      "/images/inventory-2.png",
      "/images/inventory-3.png",
    ],
    title: "Inventory Management App",
    link: "https://chris-inventory-management-app.vercel.app",
  },
];

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (project.images.length <= 1) {
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
  }, [project.images.length]);

  return (
    <motion.article
      custom={index}
      variants={projectCard}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-gray-900/50 shadow-lg shadow-black/20 transition-colors duration-300 hover:bg-gray-900"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-950">
        <AnimatePresence initial={false}>
          <motion.div
            key={project.images[currentImageIndex]}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
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
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={index === 0 && currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {project.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {project.images.map((image, imageIndex) => (
              <button
                key={image}
                type="button"
                onClick={() => setCurrentImageIndex(imageIndex)}
                aria-label={`Show ${project.title} image ${imageIndex + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
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
        <h3 className="mb-2 text-xl font-bold text-white">
          {project.title}
        </h3>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium text-cyan-200 transition-colors hover:text-cyan-100"
        >
          View Project
          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </motion.article>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="overflow-hidden px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={slideInFromUp}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mb-16 text-center text-3xl font-bold text-white md:text-4xl xl:text-5xl"
        >
          <span className="text-cyan-200">Recent Projects</span>
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
              key={project.title}
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