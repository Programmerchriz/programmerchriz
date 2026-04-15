"use client";

import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";

import Typewriter from "typewriter-effect";
import ParticlesHero from "./ParticleBackground";
import Link from "next/link";

const Hero = () => {
  return (
    <div
      id="hero"
      className="relative h-screen flex items-center justify-center text-white overflow-hidden flex-col">
      <ParticlesHero />
      <div className="relative 2-10 flex flex-col items-center">
        <Image
          src="/images/s1.jpg"
          alt="heroimage"
          width={150}
          height={150}
          className="rounded-full border-8 border-[#0c0c48aa]"
        />

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-6 tracking-wide">
          Building web products, <br />
          <span className="text-cyan-200">brands, and experiences.</span>
        </h1>
        <h2 className="mt-5 text-sm px-2 text-center sm:text-2xl font-medium flex items-center">
          Hi! I&apos;m Chris - A Passionate
          <span className="text-cyan-200 font-bold">
            <Typewriter
              options={{
                strings: [
                  " Frontend Developer",
                  " Web Developer",
                  " Software Engineer",
                ],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
                wrapperClassName: "pl-2",
              }}
            />
          </span>
        </h2>

        <Link
          href="#projects"

          className="mt-6 px-10 py-4 bg-blue-800 hover:bg-blue-900 transition-all duration-300 cursor-pointer rounded-full text-lg font-medium">
          <span>See my work</span>
          <BsArrowRight className="w-5 h-5 ml-2 inline-block" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
