"use client";

import Image from "next/image";

const Projects = () => {
  const projects = [
    {
      image: "/images/p1.png",
      title: "Modern Finance Dashboard UI",
      link: "#",
    },
    {
      image: "/images/p2.png",
      title: "Portfolio Website for Creatives",
      link: "#",
    },
  ];

  return (
    <div className="py-20 px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl xl:text-5xl font-bold text-white mb-16">
          A small selection of recent <br />
          <span className="text-cyan-200">projects</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
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
                  className="text-cyan-200 hover:text-cyan-100 transition-colors font-medium"
                >
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
