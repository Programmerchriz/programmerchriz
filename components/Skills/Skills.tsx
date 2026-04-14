"use client";

import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGithub,
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiCloudflare,
} from "react-icons/si";
import { FaDatabase, FaUsers, FaLightbulb } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";

const Skills = () => {
  const skills = [
    {
      icon: <SiJavascript className="text-4xl" />,
      name: "JavaScript",
    },
    {
      icon: <SiReact className="text-4xl" />,
      name: "React.js",
    },
    {
      icon: <SiNextdotjs className="text-4xl" />,
      name: "Next.js",
    },
    {
      icon: <SiTypescript className="text-4xl" />,
      name: "TypeScript",
    },
    {
      icon: <SiTailwindcss className="text-4xl" />,
      name: "TailwindCSS",
    },
    {
      icon: <SiGithub className="text-4xl" />,
      name: "Git/Github",
    },
    {
      icon: <FaDatabase className="text-4xl" />,
      name: "SQL",
    },
    {
      icon: <SiPostgresql className="text-4xl" />,
      name: "PostgreSQL",
    },
    {
      icon: <SiPrisma className="text-4xl" />,
      name: "Prisma",
    },
    {
      icon: <SiDocker className="text-4xl" />,
      name: "Docker",
    },
    {
      icon: <SiCloudflare className="text-4xl" />,
      name: "Cloudflare",
    },
    // {
    //   icon: <FaLightbulb className="text-4xl" />,
    //   name: "Team Leadership",
    // },
    {
      icon: <FiTarget className="text-4xl" />,
      name: "Problem Solving",
    },
    {
      icon: <FaUsers className="text-4xl" />,
      name: "Collaboration",
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl md:text-5xl font-bold text-white mb-4">
          My <span className="text-cyan-200">Skills</span>
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-16 mb-20">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-cyan-200 mb-4">{skill.icon}</div>
              <p className="text-white font-medium text-sm">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
