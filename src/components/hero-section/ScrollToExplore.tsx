"use client";
import React from "react";
import { motion } from "framer-motion";
import { BiChevronDown } from "react-icons/bi";

export const ScrollToExplore = () => {
  
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      onClick={handleScroll}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }} 
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
    >
      <span className="text-neutral-500 text-sm font-medium tracking-wide transition-colors duration-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-200">
        Scroll to explore
      </span>
      
      <motion.div
        animate={{
          y: [0, 6, 0], 
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="p-1"
      >
        <BiChevronDown className="text-3xl text-neutral-500 transition-colors duration-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-200" />
      </motion.div>
    </motion.button>
  );
};