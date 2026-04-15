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
import { motion } from "framer-motion";
import { slideInFromUp, staggerContainer, scaleIn } from "@/lib/animations";

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
    <div id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          variants={slideInFromUp}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center text-3xl md:text-5xl font-bold text-white mb-4"
        >
          My <span className="text-cyan-200">Skills</span>
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-16 mb-20"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center text-center cursor-pointer"
            >
              <motion.div
                className="text-cyan-200 mb-4"
                whileHover={{ rotateY: 10 }}
              >
                {skill.icon}
              </motion.div>
              <p className="text-white font-medium text-sm">{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
