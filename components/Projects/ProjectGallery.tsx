"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

const ProjectGallery = ({ images, title }: ProjectGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((currentIndex) => {
        return (currentIndex + 1) % images.length;
      });
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [images.length]);

  const showPreviousImage = () => {
    setDirection(-1);
    setCurrentImageIndex((currentIndex) => {
      return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    });
  };

  const showNextImage = () => {
    setDirection(1);
    setCurrentImageIndex((currentIndex) => {
      return (currentIndex + 1) % images.length;
    });
  };

  const showImage = (imageIndex: number) => {
    setDirection(imageIndex > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(imageIndex);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-950 shadow-2xl shadow-black/30">
      <div className="relative aspect-video overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={images[currentImageIndex]}
            custom={direction}
            initial={{
              x: direction > 0 ? "100%" : "-100%",
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction > 0 ? "-100%" : "100%",
              opacity: 0,
            }}
            transition={{
              x: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.3,
              },
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${title} screenshot ${currentImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d1f]/50 via-transparent to-transparent" />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Show previous screenshot"
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:border-cyan-200 hover:bg-black/70 hover:text-cyan-200"
            >
              <HiChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={showNextImage}
              aria-label="Show next screenshot"
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:border-cyan-200 hover:bg-black/70 hover:text-cyan-200"
            >
              <HiChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md">
              {images.map((image, imageIndex) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => showImage(imageIndex)}
                  aria-label={`Show screenshot ${imageIndex + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === imageIndex
                      ? "w-7 bg-cyan-200"
                      : "w-2 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;
