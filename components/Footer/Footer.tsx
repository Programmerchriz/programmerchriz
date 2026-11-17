"use client";

import Link from "next/link";
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div
      id="footer"
      className="py-12 px-4 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-muted text-center md:text-left">
              Chris Nwachukwu
            </p>
          </div>

          <div className="flex gap-4">
            {/* <Link
              href="#"
              className="w-12 h-12 bg-raised hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all"
            >
              <FaFacebook className="text-lg" />
            </Link>
            <Link
              href="#"
              className="w-12 h-12 bg-raised hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all"
            >
              <FaYoutube className="text-lg" />
            </Link>
            <Link
              href="#"
              className="w-12 h-12 bg-raised hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all"
            >
              <FaInstagram className="text-lg" />
            </Link> */}

            <Link
              href="https://x.com/Programmerchriz"
              className="w-12 h-12 bg-raised hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all"
              target="_blank"
            >
              <FaTwitter className="text-lg" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/christian-chukwuebuka-nwachukwu/"
              className="w-12 h-12 bg-raised hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all"
              target="_blank"
            >
              <FaLinkedinIn className="text-lg" />
            </Link>
            <Link
              href="https://github.com/Programmerchriz"
              className="w-12 h-12 bg-raised hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all"
              target="_blank"
            >
              <FaGithub className="text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
