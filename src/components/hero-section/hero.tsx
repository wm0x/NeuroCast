import React from "react";
import CallToAction from "./top-button";
import { ScrollToExplore } from "./ScrollToExplore";
import NeumorphButton from "../ui/neumorph-button";
import { IoIosArrowForward } from "react-icons/io";

function Hero() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center px-10 bg-black w-full rounded-2xl mt-10 pb-32">
      <CallToAction />

      <div className="text-white mt-10 text-4xl text-center items-center">
        Empowering Early Alzheimer’s Detection with AI
        <span className="flex mt-5 text-xl text-neutral-400 justify-center">
          Leveraging advanced deep learning algorithms to predict and analyze
          Alzheimer's risk with high accuracy.
        </span>
        <div className="mt-10 items-center justify-center flex flex-row">
          <NeumorphButton
            intent="secondary"
            className=" cursor-pointer flex flex-row"
          >
            Try It Now{" "}
            <span>
              <IoIosArrowForward className=" inline size-5 mb-0.5 ml-2" />
            </span>{" "}
          </NeumorphButton>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 px-4">
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🧠
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Understanding Alzheimer's
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Symptoms, Stages & Research
            </span>
          </div>
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🤝
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Caregiver Support
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Resources & Community
            </span>
          </div>
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🌱
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Brain Wellness
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Lifestyle & Activities
            </span>
          </div>
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🕰️
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Future Planning
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Legal & Financial Guidance
            </span>
          </div>
        </div>
      </div>
      <ScrollToExplore />

      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

export default Hero;
