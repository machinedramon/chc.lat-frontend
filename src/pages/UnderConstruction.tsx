import type React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";

const UnderConstruction: React.FC = () => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-[#3b1e0e] overflow-hidden px-3 sm:px-4">
      {/* Background light effects */}
      <div className="absolute top-[15%] left-[20%] h-[300px] w-[300px] rounded-full bg-[#5a3520] opacity-20 blur-lg" />
      <div className="absolute bottom-[20%] right-[15%] h-[250px] w-[250px] rounded-full bg-[#6b4530] opacity-15 blur-lg" />
      <div className="absolute top-[60%] left-[30%] h-[200px] w-[200px] rounded-full bg-[#7d5642] opacity-10 blur-lg" />
      <div className="absolute bottom-[40%] left-[10%] h-[150px] w-[150px] rounded-full bg-[#704730] opacity-15 blur-lg" />
      <div className="absolute top-[30%] right-[10%] h-[180px] w-[180px] rounded-full bg-[#805030] opacity-10 blur-lg" />

      {/* Header with logo and title */}
      <div className="mb-6 sm:mb-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <img
            src="https://i.ibb.co/KpF7CjKN/Chat-GPT-Image-10-de-mai-de-2025-00-22-43.png"
            alt="Chocolate bar"
            className="h-20 w-20"
          />
        </motion.div>
        <motion.h1
          className="text-6xl font-bold text-[#e1d6b9]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          chc.lat
        </motion.h1>
      </div>

      {/* Link shortening example - Glass effect */}
      <motion.div
        className="mb-6 sm:mb-8 overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.05)] bg-[rgba(224,219,216,0.1)] p-3 sm:p-4 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.15)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="font-mono text-base sm:text-lg text-[#e1d6b9] underline underline-offset-4 cursor-pointer">
            linktomonetize.com
          </span>
          <motion.div
            animate={{
              x: [0, 5, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.5,
            }}
          >
            <ArrowRight size={18} className="text-[#e1d6b9]" />
          </motion.div>
          <span className="font-mono text-base sm:text-lg font-medium text-[#e1d6b9] underline underline-offset-4 cursor-pointer">
            chc.lat/cff8
          </span>
        </div>
      </motion.div>

      {/* Glass card */}
      <motion.div
        className="relative w-full max-w-sm rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-5 sm:p-7 backdrop-blur-xl backdrop-filter shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Main content */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="mb-4 sm:mb-5 text-3xl sm:text-4xl font-medium text-[#e1d6b9] text-center">
              Under Construction
            </h2>
            <p className="mb-6 sm:mb-7 text-base sm:text-lg leading-relaxed text-[#e1d6b9] text-center">
              We're finalizing our link shortening service that helps you
              monetize your URLs through ads.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="w-full max-w-sm flex items-center justify-between mt-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-xs sm:text-sm text-[#8b7256]">© 2025 chc.lat</div>
        <div className="flex gap-3 sm:gap-4">
          <a
            // biome-ignore lint/a11y/useValidAnchor: <explanation>
            href="#"
            className="flex h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.05)] bg-[rgba(59,30,14,0.25)] backdrop-blur-md transition-all hover:bg-[rgba(59,30,14,0.4)]"
          >
            <FaXTwitter size={16} className="text-[#e1d6b9] sm:text-[20px]" />
          </a>
          <a
            // biome-ignore lint/a11y/useValidAnchor: <explanation>
            href="#"
            className="flex h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.05)] bg-[rgba(59,30,14,0.25)] backdrop-blur-md transition-all hover:bg-[rgba(59,30,14,0.4)]"
          >
            <FaTelegramPlane
              size={16}
              className="text-[#e1d6b9] sm:text-[20px]"
            />
          </a>
          <a
            // biome-ignore lint/a11y/useValidAnchor: <explanation>
            href="#"
            className="flex h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.05)] bg-[rgba(59,30,14,0.25)] backdrop-blur-md transition-all hover:bg-[rgba(59,30,14,0.4)]"
          >
            <FaDiscord size={16} className="text-[#e1d6b9] sm:text-[20px]" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default UnderConstruction;
