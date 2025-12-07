"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { TextReveal } from "@/components/ui/text-reveal";
import { cn } from "@/lib/utils";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
};

// V1 is the only one you are using for the title
const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0]
  );

  return (
    <motion.span
      className={cn("inline-block text-neutral-700 ", isSpace && "w-4")}
      style={{
        x,
        rotateX,
      }}
    >
      {char}
    </motion.span>
  );
};

const AboutUsSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  // We only need useScroll for the top title animation
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const text = "More About Us";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <main className="w-full bg-[#f7f7f7]">
      <div
        ref={targetRef}
        className="relative box-border flex h-[100vh] items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
      >
        <div
          className="font-geist w-full max-w-4xl text-center text-6xl font-bold uppercase tracking-tighter text-black"
          style={{
            perspective: "500px",
          }}
        >
          {characters.map((char, index) => (
            <CharacterV1
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      <div className="md:-mt-[20vh] ">
        <TextReveal>
          We are three Computer Science students from FCIT at King Abdulaziz
          University, united by a mission to transform Alzheimer’s management.
          Our project leverages multimodal deep learning to shift care from
          reactive diagnosis to predictive foresight. By decoding complex
          clinical data into real-time progression forecasts, we empower
          clinicians and families with the clarity needed for proactive planning
          and better quality of life.
        </TextReveal>
      </div>

      <div className="relative box-border flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-4 py-20 md:gap-12 md:px-8 lg:px-16 -translate-y-52">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-geist flex items-center justify-center gap-2 text-lg font-medium tracking-tight text-neutral-600 md:gap-3 md:text-2xl"
        >
          <Bracket className="h-8 text-black md:h-12" />
          <span className="font-geist font-medium">meet the team</span>
          <Bracket className="h-8 scale-x-[-1] text-black md:h-12" />
        </motion.p>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl md:p-8"
          >
            <div className="relative z-10">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-black bg-neutral-50 text-3xl font-bold text-black">
                <img
                  src="https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Felix"
                  alt=""
                  className="rounded-full"
                />
              </div>
              <h3 className="font-geist mb-1 text-2xl font-bold tracking-tight text-black md:text-3xl">
                Ali
              </h3>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
                Manager & Full Stack
              </p>
              <p className="font-geist text-sm leading-relaxed text-neutral-600 md:text-base">
                Leading the team with vision and technical expertise, building
                end-to-end solutions.
              </p>
            </div>
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-neutral-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl md:p-8"
          >
            <div className="relative z-10">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-black bg-neutral-50 text-3xl font-bold text-black">
                J
              </div>
              <h3 className="font-geist mb-1 text-2xl font-bold tracking-tight text-black md:text-3xl">
                Jasser
              </h3>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
                Core Team Member
              </p>
              <p className="font-geist text-sm leading-relaxed text-neutral-600 md:text-base">
                Driving innovation with dedication and technical prowess in deep
                learning solutions.
              </p>
            </div>
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-neutral-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl md:p-8"
          >
            <div className="relative z-10">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-black bg-neutral-50 text-3xl font-bold text-black">
                <img
                  src="https://api.dicebear.com/9.x/notionists/svg?seed=Kingston"
                  alt=""
                  className="rounded-full"
                />
              </div>
              <h3 className="font-geist mb-1 text-2xl font-bold tracking-tight text-black md:text-3xl">
                Khalid
              </h3>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
                Core Team Member
              </p>
              <p className="font-geist text-sm leading-relaxed text-neutral-600 md:text-base">
                Contributing essential expertise to create meaningful healthcare
                impact.
              </p>
            </div>
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-neutral-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export { AboutUsSection };

const Bracket = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={className}
    >
      <path
        fill="#000"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      ></path>
    </svg>
  );
};
