"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiPlus, BiMinus } from "react-icons/bi";
import { StripedPattern } from "./Striped";

const faqData = [
  {
    question: "How is this different from existing diagnosis tools?",
    answer:
      "Most current models focus only on classification (diagnosing sick vs. healthy)[cite: 22]. [cite_start]Our system is the first to focus on 'Progression Forecasting', using longitudinal data to predict exactly how the disease will evolve over time rather than just providing a single snapshot[cite: 25].",
  },
  {
    question: "What specific data does the AI analyze?",
    answer:
      "We use a multimodal approach. [cite_start]The model analyzes time-invariant genetics (like APOE ε4), longitudinal biomarkers (MRI volumes, PET scans), and clinical notes processed via NLP to capture specific symptom descriptions[cite: 34, 36, 49, 63].",
  },
  {
    question: "How does this benefit patients and families?",
    answer:
      "By providing personalized progression forecasts, we enable better family preparedness. [cite_start]Caregivers can set realistic expectations and make appropriate legal and financial plans before the disease reaches advanced stages[cite: 106].",
  },
  {
    question: "How will this be implemented in hospitals?",
    answer:
      "The system is designed to integrate directly into neurology workflows via Electronic Medical Records (EMR)[cite: 108]. [cite_start]It also supports clinical trial enrichment by identifying ideal candidates for specific trial phases[cite: 106].",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  toggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-4">
      <button
        onClick={toggle}
        className={`flex items-center justify-between w-full px-6 py-4 text-left transition-all duration-300 rounded-xl border ${
          isOpen
            ? "bg-white shadow-md border-transparent"
            : "bg-neutral-100 hover:bg-neutral-200/50 border-transparent"
        }`}
      >
        <span className="text-lg font-medium text-neutral-800">{question}</span>
        <div
          className={`p-1 rounded-full transition-colors duration-300 ${
            isOpen ? "bg-black text-white" : "bg-neutral-300 text-neutral-600"
          }`}
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
            <div className="px-6 py-4 text-neutral-600 leading-relaxed bg-white/50 rounded-b-xl mx-2">
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

  return (
    <div className=" relative bg-black min-h-screen h-auto flex flex-col justify-center items-center rounded-2xl py-20">
      <StripedPattern className="stroke-[0.3] [stroke-dasharray:8,4] opacity-50 text-gray-500 " />

      <div className="text-center mb-16 px-4 z-10">
        <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
          FAQ.
        </h2>
        <p className="text-neutral-500 text-lg font-light">
          Looking for answers? It&apos;s here.
        </p>
      </div>

      <div className="w-full px-4 z-10">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            toggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQ;
