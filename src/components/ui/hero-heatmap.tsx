"use client"

import * as React from "react"
import { Heatmap } from "@paper-design/shaders-react"
import { cn } from "@/lib/utils"

const MemoizedHeatmap = React.memo(Heatmap)

// الخصائص الأساسية للتأثير اللوني بنفس الألوان المطلوبة
const defaultShaderProps = {
  image: "/logo.png", // الصورة التي يتم بناء التأثير حولها
  colors: [
    "#112069",
    "#1f3ca3",
    "#367c66",
    "#adfa1e",
    "#ffe77a",
    "#ff9a1f",
    "#ed40b3",
  ],
  colorBack: "#000000",
  contour: 0.5, // إذا كنت تقصد بـ "النقاط" خطوط الكنتور، يمكنك تغيير هذه القيمة إلى 0 لجعلها ناعمة تماماً
  angle: 0,
  noise: 0,
  innerGlow: 0.5,
  outerGlow: 0.5,
  speed: 1,
  scale: 0.55,
}

export interface HeroHeatmapProps extends React.ComponentPropsWithoutRef<"div"> {
  shaderProps?: Partial<typeof defaultShaderProps>
}

export default function HeroHeatmap({
  className,
  shaderProps,
  ...props
}: HeroHeatmapProps) {
  
  const mergedShaderProps = {
    ...defaultShaderProps,
    ...shaderProps,
    style: { width: "100%", height: "100%" }
  }

  return (
    <div
      className={cn(
        "relative w-full h-screen min-h-[500px] overflow-hidden bg-black flex items-center justify-center",
        className
      )}
      {...props}
    >
      <MemoizedHeatmap {...mergedShaderProps} />
    </div>
  )
}