"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  slideInFromUp,
  slideInFromLeft,
  slideInFromRight,
  staggerContainer,
} from "@/lib/animations";

const Projects = () => {
  const projects = [
    {
      image: "/images/p1.png",
      title: "Modern Finance Dashboard",
      link: "https://coin-global.vercel.app",
    },
    {
      image: "/images/p2.png",
      title: "Inventory Management App",
      link: "https://chris-inventory-management-app.vercel.app",
    },
  ];

  return (
    <div id="projects" className="py-20 px-10">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          variants={slideInFromUp}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center text-3xl md:text-4xl xl:text-5xl font-bold text-white mb-16"
        >
          A small selection of recent <br />
          <span className="text-cyan-200">projects</span>
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={index === 0 ? slideInFromLeft : slideInFromRight}
              className="group relative rounded-lg overflow-hidden bg-gray-900/50 hover:bg-gray-900 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-200 hover:text-cyan-100 transition-colors font-medium"
                >
                  View Project →
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
