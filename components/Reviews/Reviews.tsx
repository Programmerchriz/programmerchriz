"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  slideInFromUp,
  staggerContainer,
  slideInFromLeft,
  slideInFromRight,
} from "@/lib/animations";

const Reviews = () => {
  const reviews = [
    {
      image: "/images/c1.png",
      name: "Jora Doe",
      title: "CEO , Design Studio",
      review:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae modi repellat veniam ratione perspiciatis ut rem reprehenderit commodi officia doloribus.",
    },
    {
      image: "/images/c2.png",
      name: "Janny Doe",
      title: "CEO , Landscape",
      review:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae modi repellat veniam ratione perspiciatis ut rem reprehenderit commodi officia doloribus.",
    },
    {
      image: "/images/c3.png",
      name: "John Doe",
      title: "UI UX Designer",
      review:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae modi repellat veniam ratione perspiciatis ut rem reprehenderit commodi officia doloribus.",
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
          Kind words from satisfied <br />
          <span className="text-cyan-200">clients</span>
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              variants={slideInFromUp}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 rounded-lg p-8 hover:bg-gray-900/80 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="relative w-14 h-14"
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </motion.div>
                <div>
                  <h3 className="text-cyan-200 font-bold">{review.name}</h3>
                  <p className="text-gray-400 text-sm">{review.title}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                &quot;{review.review}&quot;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
