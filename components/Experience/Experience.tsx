"use client";

import { FiBox, FiDatabase } from "react-icons/fi";
import { SiReact } from "react-icons/si";

const Experience = () => {
  const workExperience = [
    {
      icon: <FiBox className="text-3xl" />,
      title: "Full-Stack Developer",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eum laudantium sapiente cumque distinctio.",
    },
    {
      icon: <SiReact className="text-3xl" />,
      title: "Front-End Developer",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eum laudantium sapiente cumque distinctio.",
    },
    {
      icon: <FiDatabase className="text-3xl" />,
      title: "Backend Developer",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eum laudantium sapiente cumque distinctio.",
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
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-1">
          {/* Work Experience */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              My Work <span className="text-cyan-200">Experience</span>
            </h2>
            <div className="space-y-8">
              {workExperience.map((job, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0 text-cyan-200 mt-1">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {/* <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              My <span className="text-cyan-200">Education</span>
            </h2>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 text-cyan-200 mt-1">
                    {edu.icon}
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-blue-900/30 px-4 py-2 rounded-full text-white text-sm mb-2">
                      {edu.period}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 block">
                      {edu.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Experience;
