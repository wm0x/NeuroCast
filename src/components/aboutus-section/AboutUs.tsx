/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
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
      className={cn("inline-block text-neutral-700", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

const TEAM = [
  {
    name: "Ali",
    role: "Leader & Full Stack",
    bio: "Leading the team with vision and technical expertise, building end-to-end solutions.",
    avatar: "/MyFace.jpeg",
  },
  {
    name: "Jasser",
    role: "Core Team Member",
    bio: "Driving innovation with dedication and technical prowess in deep learning solutions.",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Brian",
  },
  {
    name: "Khalid",
    role: "Core Team Member",
    bio: "Contributing essential expertise to create meaningful healthcare impact.",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Kingston",
  },
];

const AboutUsSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const text = "More About Us";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <main className="w-full bg-[#f7f7f7]">
      {/* ── Scroll title ── */}
      <div
        ref={targetRef}
        className="relative flex h-screen items-center justify-center overflow-hidden p-[2vw]"
      >
        <div
          className="font-geist w-full max-w-4xl text-center text-6xl font-bold uppercase tracking-tighter text-black"
          style={{ perspective: "500px" }}
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

      {/* ── Text reveal ── */}
      <div className="md:-mt-[20vh]">
        <TextReveal>
          We are three Computer Science students from FCIT at King Abdulaziz
          University, united by a mission to transform Alzheimer's management.
          Our project leverages multimodal deep learning to shift care from
          reactive diagnosis to predictive foresight. By decoding complex
          clinical data into real-time progression forecasts, we empower
          clinicians and families with the clarity needed for proactive planning
          and better quality of life.
        </TextReveal>
      </div>

      {/* ── Team section ── */}
      <div className="relative flex flex-col items-center gap-5 px-4 py-10 -translate-y-40 md:px-8 lg:px-16">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-geist flex items-center gap-2 text-lg font-medium tracking-tight text-neutral-600 md:gap-3 md:text-2xl"
        >
          <Bracket className="h-8 text-black md:h-12" />
          <span className="font-medium">the team</span>
          <Bracket className="h-8 scale-x-[-1] text-black md:h-12" />
        </motion.p>

        {/* ── Advisor card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group w-full max-w-6xl overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-amber-300/60">
              <img
                src="https://scholar.googleusercontent.com/citations?view_op=view_photo&user=ki5_hZoAAAAJ&citpid=2"
                alt="Dr. Asif"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="mb-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Faculty Advisor
              </span>
              <h3 className="font-geist text-xl font-bold tracking-tight text-black">
                Dr. Asif
              </h3>
              <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
                Providing academic guidance and domain expertise in AI and
                healthcare systems, ensuring our research meets the highest
                standards of scientific rigor.
              </p>
            </div>
            <div className="hidden shrink-0 text-2xl md:block">🎓</div>
          </div>
        </motion.div>

        {/* ── Student cards ── */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative z-10">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-neutral-50 overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-geist mb-0.5 text-2xl font-bold tracking-tight text-black">
                  {member.name}
                </h3>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {member.role}
                </p>
                <p className="font-geist text-sm leading-relaxed text-neutral-600">
                  {member.bio}
                </p>
              </div>
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-neutral-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
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
