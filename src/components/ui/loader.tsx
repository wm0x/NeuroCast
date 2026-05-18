//this is loader component for use it in app/loading.tsx main loader in app 
//هذا الكومبونت يستخدم في الملف الاساسي اللي يعمل اثناء تحميل الصفحات loader,tsx 

"use client"; 

import { motion } from "framer-motion";

export const LoaderOne = ({ text = " ... ثواني بس  " }: { text?: string }) => {
  return (
    <div className="relative font-bold perspective-[1000px] text-white">
      <motion.span
        animate={{
          skewX: [0, -40, 0], 
          scaleX: [1, 2, 1],
        }}
        transition={{
          duration: 0.05,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
          ease: "linear",
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
        className="relative z-20 inline-block"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-[#00e571]/50 blur-[0.5px] dark:text-[#00e571]"
        animate={{
          x: [-2, 4, -3, 1.5, -2],
          y: [-2, 4, -3, 1.5, -2],
          opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-[#8b00ff]/50 dark:text-[#8b00ff]"
        animate={{
          x: [0, 1, -1.5, 1.5, -1, 0],
          y: [0, -1, 1.5, -0.5, 0],
          opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
          times: [0, 0.3, 0.6, 0.8, 1],
        }}
        
      >
        {text}
      </motion.span>
    </div>
  );
};

  export const LoaderTwo = ({ text }: { text: string }) => {
    return (
      <div className="font-sans font-bold [--shadow-color:var(--color-neutral-500)] dark:[--shadow-color:var(--color-neutral-100)]">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.1, 1],
              textShadow: [
                "0 0 0 var(--shadow-color)",
                "0 0 1px var(--shadow-color)",
                "0 0 0 var(--shadow-color)",
              ],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.05,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    );
  };