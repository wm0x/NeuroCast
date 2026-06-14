"use client"

import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(" ")

  return (
    <div ref={targetRef} className={cn("relative z-10 h-[200vh] -translate-y-36", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center justify-center bg-transparent px-4 py-20"
        }
      >
        <span
          ref={targetRef}
          className={
            // 1. Unrevealed text: Muted, deep cyan instead of gray
            "flex flex-wrap justify-center p-5 text-lg mt-32 md:mt-0 font-bold text-cyan-900/30 dark:text-cyan-100/20 text-center md:p-8 md:text-4xl"
          }
        >
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            )
          })}
        </span>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-1.5 flex justify-center text-center">
      <span className="absolute">{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        // 2. Revealed text: Vibrant, lively teal instead of black/white
        className={"text-teal-600 dark:text-teal-300 text-center"}
      >
        {children}
      </motion.span>
    </span>
  )
}