"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slideInFromUp, staggerContainer } from "@/lib/animations";

const Blogs = () => {
  const blogs = [
    {
      image: "/images/b1.jpg",
      title: "Learn how to build an amazing portfolio website using next js",
      tags: ["React", "Next JS", "Tailwind"],
      date: "5 July 2025",
    },
    {
      image: "/images/b2.jpg",
      title: "Learn how to build an amazing Blog website using next js",
      tags: ["React", "Next JS", "Tailwind"],
      date: "5 July 2025",
    },
    {
      image: "/images/b3.jpg",
      title: "Learn how to build an amazing Social Media website using next js",
      tags: ["React", "Next JS", "Tailwind"],
      date: "5 July 2025",
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          variants={slideInFromUp}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center text-3xl md:text-5xl font-bold text-white mb-16"
        >
          My latest <span className="text-cyan-200">Blogs</span>
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              variants={slideInFromUp}
              whileHover={{ y: -10 }}
              className="group rounded-lg overflow-hidden bg-gray-900/50 hover:bg-gray-900 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-3">{blog.date}</p>
                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                  {blog.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 bg-blue-900/50 text-cyan-200 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Blogs;
