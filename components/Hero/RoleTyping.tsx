"use client";

import Typewriter from "typewriter-effect";
import useReducedMotion from "@/components/Helper/useReducedMotion";

export default function RoleTyping() {
  const reducedMotion = useReducedMotion();
  return (
    <>
      <span className="sr-only">Software Engineer, Fullstack Engineer, Frontend Engineer, and Backend Engineer.</span>
      <span aria-hidden="true" className="role-text">
        {reducedMotion ? "Software Engineer" : (
          <Typewriter component="span" options={{
            strings: ["Software Engineer", "Fullstack Engineer", "Frontend Engineer", "Backend Engineer"],
            autoStart: true,
            loop: true,
            delay: 65,
            deleteSpeed: 35,
          }} />
        )}
      </span>
    </>
  );
}
