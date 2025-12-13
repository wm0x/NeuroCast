import React from "react";
import CallToAction from "./top-button";
import { ScrollToExplore } from "./ScrollToExplore";
import NeumorphButton from "../ui/neumorph-button";
import { IoIosArrowForward } from "react-icons/io";
import { ExpandableScreen, ExpandableScreenContent, ExpandableScreenTrigger } from "../ui/expandable-screen";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";

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

              <ExpandableScreen
      layoutId="cta-card"
      triggerRadius="100px"
      contentRadius="24px"
    >
          <ExpandableScreenTrigger>
          <NeumorphButton
            intent="secondary"
            className=" cursor-pointer flex flex-row"
          >
            Try It Now{" "}
            <span>
              <IoIosArrowForward className=" inline size-5 mb-0.5 ml-2" />
            </span>{" "}
          </NeumorphButton>
          </ExpandableScreenTrigger>
<ExpandableScreenContent className="bg-[#121212]">
  <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto items-start">
<div className="w-full lg:flex-1 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-6 sm:p-10 lg:p-16 space-y-6 bg-[#121212] z-20">
  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-primary-foreground leading-none tracking-[-0.03em]">
    Predicting the Course of Alzheimer's
  </h2>

  <div className="space-y-5 sm:space-y-6 pt-4">
    {/* Feature 1 */}
    <div className="flex gap-3 sm:gap-4">
      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
        {/* Brain/Data Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm sm:text-base text-primary-foreground leading-[150%]">
          <strong>Multimodal Fusion:</strong> Combines longitudinal cognitive scores, MRI biomarkers, and genetic data to deliver highly accurate progression forecasts.
        </p>
      </div>
    </div>

    {/* Feature 2 */}
    <div className="flex gap-3 sm:gap-4">
      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
        {/* Chart/Trending Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm sm:text-base text-primary-foreground leading-[150%]">
          <strong>Personalized Trajectories:</strong> Offers clinicians real-time estimates of disease progression, enabling optimized care planning and timely interventions.
        </p>
      </div>
    </div>
  </div>

  {/* Quote Section */}
  <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-primary-foreground/20">
    <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground leading-[150%] mb-4">
      "This approach marks a transition from reactive to predictive neurology, transforming the management of chronic neurodegenerative conditions."
    </p>

    <div className="flex flex-col items-center gap-2 sm:gap-4 w-full text-center">
      <p className="text-base sm:text-lg lg:text-xl text-primary-foreground">
        NeuroCast System
      </p>
      <p className="text-sm sm:text-base text-primary-foreground/70">
        Deep Learning Framework
      </p>
    </div>

    {/* Copyright */}
    <p className="text-xs sm:text-sm text-primary-foreground/50 mt-6 text-center">
      &copy; 2025 FCIT College. Developed by students of FCIT. All rights reserved.
    </p>
  </div>
</div>


    <div className="w-full lg:flex-1 p-6 sm:p-10 lg:p-16 lg:min-h-screen flex flex-col justify-center">
      <form className="space-y-4 sm:space-y-5 text-start w-full">
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase text-start">
            FULL NAME *
          </Label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            EMAIL *
          </Label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              USE CASE
            </Label>
            <input
              type="text"
              name="use-case"
              placeholder="e.g., Project management, Team collaboration"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm h-10"
            />
          </div>
          <div className="sm:w-32 w-full">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              TEAM SIZE
            </Label>
             <input
              type="number"
              name="team-size"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
            />
          </div>
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            WHAT ARE YOU MOST EXCITED ABOUT?
          </Label>
          <textarea
            name="excited-about"
            rows={3}
            placeholder="Tell us what features you're looking forward to..."
            className="w-full px-4 py-3 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm"
          />
        </div>
                <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase text-start">
            FULL NAME *
          </Label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            EMAIL *
          </Label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              USE CASE
            </Label>
            <input
              type="text"
              name="use-case"
              placeholder="e.g., Project management, Team collaboration"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm h-10"
            />
          </div>
          <div className="sm:w-32 w-full">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              TEAM SIZE
            </Label>
             <input
              type="number"
              name="team-size"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
            />
          </div>
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            WHAT ARE YOU MOST EXCITED ABOUT?
          </Label>
          <textarea
            name="excited-about"
            rows={3}
            placeholder="Tell us what features you're looking forward to..."
            className="w-full px-4 py-3 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm"
          />
        </div>
                <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase text-start">
            FULL NAME *
          </Label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            EMAIL *
          </Label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              USE CASE
            </Label>
            <input
              type="text"
              name="use-case"
              placeholder="e.g., Project management, Team collaboration"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm h-10"
            />
          </div>
          <div className="sm:w-32 w-full">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              TEAM SIZE
            </Label>
             <input
              type="number"
              name="team-size"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
            />
          </div>
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            WHAT ARE YOU MOST EXCITED ABOUT?
          </Label>
          <textarea
            name="excited-about"
            rows={3}
            placeholder="Tell us what features you're looking forward to..."
            className="w-full px-4 py-3 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm"
          />
        </div>
                <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase text-start">
            FULL NAME *
          </Label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            EMAIL *
          </Label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              USE CASE
            </Label>
            <input
              type="text"
              name="use-case"
              placeholder="e.g., Project management, Team collaboration"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm h-10"
            />
          </div>
          <div className="sm:w-32 w-full">
            <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
              TEAM SIZE
            </Label>
             <input
              type="number"
              name="team-size"
              className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10"
            />
          </div>
        </div>
        <div>
          <Label className="block text-[10px] font-mono font-normal text-primary-foreground mb-2 tracking-[0.5px] uppercase">
            WHAT ARE YOU MOST EXCITED ABOUT?
          </Label>
          <textarea
            name="excited-about"
            rows={3}
            placeholder="Tell us what features you're looking forward to..."
            className="w-full px-4 py-3 rounded-lg bg-card border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm"
          />
        </div>

 

        <Button
          type="submit"
          className="w-full px-8 py-2.5 rounded-full bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors tracking-[-0.03em] h-10"
        >
          Join waitlist
        </Button>
      </form>
    </div>
  </div>
</ExpandableScreenContent>
              </ExpandableScreen>

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
