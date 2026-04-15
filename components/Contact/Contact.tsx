"use client";

import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromUp,
} from "@/lib/animations";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setStatusMessage(
          "Message sent successfully! I'll get back to you soon.",
        );
        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          message: "",
        });
      } else {
        setStatus("error");
        setStatusMessage(
          data.error || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideInFromLeft}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Schedule a call with me to see if I can help
            </h1>
            <p className="text-gray-400 mb-8 text-lg">
              Reach out to me today and let&apos;s discuss how I can help you
              achieve your goals.
            </p>

            <div className="space-y-6 mb-12">
              <motion.div
                className="flex items-center gap-4 text-cyan-200"
                whileHover={{ x: 10 }}
              >
                <FiPhone className="text-2xl" />
                <span className="text-white text-lg">+2348104948700</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-4 text-cyan-200"
                whileHover={{ x: 10 }}
              >
                <FiMail className="text-2xl" />
                <span className="text-white text-lg">
                  chrisnwachukwu107@gmail.com
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-4 text-cyan-200"
                whileHover={{ x: 10 }}
              >
                <FiMapPin className="text-2xl" />
                <span className="text-white text-lg">Lagos, Nigeria</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideInFromRight}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gray-900/50 rounded-lg p-8"
          >
            {/* Status Messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-400"
              >
                {statusMessage}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400"
              >
                {statusMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                whileFocus={{ scale: 1.02 }}
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors disabled:opacity-50"
                disabled={isLoading}
              />
              <motion.input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                whileFocus={{ scale: 1.02 }}
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors disabled:opacity-50"
                disabled={isLoading}
              />
              <motion.input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                whileFocus={{ scale: 1.02 }}
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors disabled:opacity-50"
                disabled={isLoading}
              />
              <motion.textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                whileFocus={{ scale: 1.02 }}
                className="w-full bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-200 transition-colors resize-none disabled:opacity-50"
                disabled={isLoading}
              ></motion.textarea>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
