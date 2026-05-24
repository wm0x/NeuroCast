"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiPlus, BiMinus } from "react-icons/bi";
import { StripedPattern } from "./Striped";

const faqData = [
  {
    question: "How is this different from existing diagnosis tools?",
    answer:
      "Most current models focus only on classification (diagnosing sick vs. healthy). Our system is the first to focus on 'Progression Forecasting', using longitudinal data to predict exactly how the disease will evolve over time rather than just providing a single snapshot.",
    accentColor: "#adfa1e",
    glowColor: "rgba(173, 250, 30, 0.15)",
  },
  {
    question: "What specific data does the AI analyze?",
    answer:
      "We use a multimodal approach. The model analyzes time-invariant genetics (like APOE ε4), longitudinal biomarkers (MRI volumes, PET scans), and clinical notes processed via NLP to capture specific symptom descriptions.",
    accentColor: "#ed40b3",
    glowColor: "rgba(237, 64, 179, 0.15)",
  },
  {
    question: "How does this benefit patients and families?",
    answer:
      "By providing personalized progression forecasts, we enable better family preparedness. Caregivers can set realistic expectations and make appropriate legal and financial plans before the disease reaches advanced stages.",
    accentColor: "#ff9a1f",
    glowColor: "rgba(255, 154, 31, 0.15)",
  },
  {
    question: "How will this be implemented in hospitals?",
    answer:
      "The system is designed to integrate directly into neurology workflows via Electronic Medical Records (EMR). It also supports clinical trial enrichment by identifying ideal candidates for specific trial phases.",
    accentColor: "#367c66",
    glowColor: "rgba(54, 124, 102, 0.15)",
  },
];

const AmbientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
    {/* Top-left deep blue orb */}
    <div
      className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
      style={{ background: "radial-gradient(circle, #1f3ca3 0%, transparent 70%)" }}
    />
    {/* Top-right pink orb */}
    <div
      className="absolute -top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
      style={{ background: "radial-gradient(circle, #ed40b3 0%, transparent 70%)" }}
    />
    {/* Bottom-left green orb */}
    <div
      className="absolute bottom-0 -left-16 w-80 h-80 rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, #367c66 0%, transparent 70%)" }}
    />
    {/* Bottom-right yellow orb */}
    <div
      className="absolute -bottom-24 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
      style={{ background: "radial-gradient(circle, #ffe77a 0%, transparent 70%)" }}
    />
    {/* Center accent — lime */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
      style={{ background: "radial-gradient(circle, #adfa1e 0%, transparent 70%)" }}
    />
  </div>
);

const ColorAccentBar = ({ color }: { color: string }) => (
  <motion.div
    initial={{ scaleY: 0, opacity: 0 }}
    animate={{ scaleY: 1, opacity: 1 }}
    exit={{ scaleY: 0, opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full origin-top"
    style={{ background: color }}
  />
);

const FAQItem = ({
  question,
  answer,
  accentColor,
  glowColor,
  isOpen,
  toggle,
}: {
  question: string;
  answer: string;
  accentColor: string;
  glowColor: string;
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-4">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full px-6 py-4 text-left transition-all duration-300 rounded-xl border relative overflow-hidden"
        style={
          isOpen
            ? {
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                borderColor: `${accentColor}33`,
                boxShadow: `0 0 24px 0 ${glowColor}, inset 0 0 12px 0 ${glowColor}`,
              }
            : {
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                borderColor: "rgba(255,255,255,0.06)",
              }
        }
      >
        {isOpen && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(120deg, transparent 60%, ${glowColor} 100%)`,
            }}
          />
        )}

        <span
          className="text-lg font-medium transition-colors duration-300 relative z-10"
          style={{ color: isOpen ? "#ffffff" : "#d4d4d4" }}
        >
          {question}
        </span>

        <div
          className="p-1 rounded-full transition-all duration-300 relative z-10 shrink-0 ml-4"
          style={
            isOpen
              ? {
                  background: accentColor,
                  color: "#000",
                  boxShadow: `0 0 10px 2px ${glowColor}`,
                }
              : {
                  background: "rgba(255,255,255,0.1)",
                  color: "#9ca3af",
                }
          }
        >
          {isOpen ? <BiMinus size={20} /> : <BiPlus size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-6 py-4 leading-relaxed rounded-b-xl mx-2 relative"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderLeft: `1px solid ${accentColor}44`,
                borderRight: `1px solid ${accentColor}22`,
                borderBottom: `1px solid ${accentColor}22`,
                color: "#a3a3a3",
              }}
            >
              <ColorAccentBar color={accentColor} />
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const activeAccent =
    openIndex !== null ? faqData[openIndex].accentColor : "#adfa1e";

  return (
    <div className="relative bg-black min-h-screen h-auto flex flex-col justify-center items-center rounded-2xl py-20 overflow-hidden">
      <StripedPattern className="stroke-[0.3] [stroke-dasharray:8,4] opacity-30 text-gray-600" />

      <AmbientOrbs />

      <div className="text-center mb-16 px-4 z-10 relative">
        <h2
          className="text-5xl font-black text-white mb-4 tracking-tight transition-all duration-700"
          style={{
            textShadow: `0 0 60px ${activeAccent}55, 0 0 120px ${activeAccent}22`,
          }}
        >
          FAQ.
        </h2>
        <p className="text-neutral-500 text-lg font-light">
          Looking for answers? It&apos;s here.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          {faqData.map((item, i) => (
            <motion.div
              key={i}
              className="h-0.5 rounded-full transition-all duration-500"
              animate={{
                width: openIndex === i ? 32 : 8,
                opacity: openIndex === i ? 1 : 0.3,
              }}
              style={{ background: item.accentColor }}
            />
          ))}
        </div>
      </div>

      <div className="w-full px-4 z-10 relative">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            accentColor={item.accentColor}
            glowColor={item.glowColor}
            isOpen={openIndex === index}
            toggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQ;