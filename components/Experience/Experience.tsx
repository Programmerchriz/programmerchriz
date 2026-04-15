"use client";

import { FiBox, FiDatabase } from "react-icons/fi";
import { SiReact } from "react-icons/si";
import WorkCard from "../WorkCard/WorkCard";
import { motion } from "framer-motion";
import { slideInFromUp, staggerContainer } from "@/lib/animations";

const Experience = () => {
  const workExperience = [
    {
      icon: <FiBox className="text-3xl" />,
      title: "Front End Developer",
      description:
        "Collaborated with a cross-functional team of engineers to develop and maintain complex software applications. Leveraged React.js, TypeScript, and Git to implement efficient development workflows and architected responsive user interfaces ensuring high performance.",
      period: "September 2024 – January 2025",
      company: "Apexbyte",
    },
    {
      icon: <SiReact className="text-3xl" />,
      title: "Front End Developer",
      description:
        "Designed and implemented modern user interfaces using React.js and Tailwind CSS. Ensured cross-browser compatibility and mobile responsiveness across diverse platforms. Integrated reusable components strategically to reduce development time.",
      period: "August 2023 – September 2023",
      company: "Flip To Tech",
    },
    {
      icon: <FiDatabase className="text-3xl" />,
      title: "Junior Developer",
      description:
        "Spearheaded technical instruction for over 100 students focusing on HTML, CSS, and JavaScript fundamentals. Assisted senior developers in debugging, code optimization, and the implementation of new project features.",
      period: "March 2023 – August 2023",
      company: "Flip To Tech",
    },
  ];

  const education = [
    {
      icon: <SiReact className="text-3xl" />,
      period: "Jan 2023 - Dec 2024",
      title: "Design Institute of Technology",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eum laudantium sapiente cumque distinctio.",
    },
    {
      icon: <FiBox className="text-3xl" />,
      period: "Jan 2019 - Dec 2022",
      title: "Bachelor in Computer Science",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eum laudantium sapiente cumque distinctio.",
    },
  ];

  return (
    <div
      id="experience"
      className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-1">
          {/* Work Experience */}
          <div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              variants={slideInFromUp}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            >
              My Work <span className="text-cyan-200">Experience</span>
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {workExperience.map((job, index) => (
                <motion.div key={index} variants={slideInFromUp}>
                  <WorkCard
                    icon={job.icon}
                    title={job.title}
                    description={job.description}
                    period={job.period}
                    company={job.company}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
