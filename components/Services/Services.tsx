"use client";

import { MdDesignServices } from "react-icons/md";
import { FiCode, FiTrendingUp, FiRotateCcw } from "react-icons/fi";

const Services = () => {
  const services = [
    {
      icon: <MdDesignServices className="text-3xl" />,
      title: "UI and UX",
      description:
        "Designing interfaces that are intuitive, efficient, and enjoyable to use.",
    },
    {
      icon: <FiCode className="text-3xl" />,
      title: "Web and Mobile App",
      description:
        "Designing interfaces that are intuitive, efficient, and enjoyable to use.",
    },
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: "Design & Creative",
      description:
        "Designing interfaces that are intuitive, efficient, and enjoyable to use.",
    },
    {
      icon: <FiRotateCcw className="text-3xl" />,
      title: "Development",
      description:
        "Designing interfaces that are intuitive, efficient, and enjoyable to use.",
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl xl:text-5xl font-bold text-white mb-16">
          Collaborate with brand <br /> and agencies to create <br /> impactful
          results
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-cyan-200">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {service.title}
              </h2>
              <p className="text-gray-400 text-lg">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
