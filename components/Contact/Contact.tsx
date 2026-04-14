"use client";

import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Schedule a call with me to see if I can help
            </h1>
            <p className="text-gray-400 mb-8 text-lg">
              Reach out to me today and let&apos;s discuss how I can help you
              achieve your goals.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 text-cyan-200">
                <FiPhone className="text-2xl" />
                <span className="text-white text-lg">+2348104948700</span>
              </div>
              <div className="flex items-center gap-4 text-cyan-200">
                <FiMail className="text-2xl" />
                <span className="text-white text-lg">
                  chrisnwachukwu107@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-4 text-cyan-200">
                <FiMapPin className="text-2xl" />
                <span className="text-white text-lg">Lagos, Nigeria</span>
              </div>
            </div>

            {/* <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
              >
                <FaYoutube className="text-xl" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-900/50 hover:bg-blue-800 rounded-full flex items-center justify-center text-cyan-200 transition-all"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div> */}
          </div>

          {/* Right Side - Form */}
          <div className="bg-gray-900/50 rounded-lg p-8">
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
