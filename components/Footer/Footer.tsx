"use client";

import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-gray-400 text-center md:text-left">
              Sajal - Personal Portfolio Website
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
            >
              <FaFacebook className="text-lg" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
            >
              <FaYoutube className="text-lg" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
            >
              <FaTwitter className="text-lg" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
            >
              <FaInstagram className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
