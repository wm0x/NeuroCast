'use client';

import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import * as React from 'react';

interface DualRangeSliderProps {
  className?: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  tickCount?: number;
}

const DualRangeSlider = React.forwardRef<HTMLDivElement, DualRangeSliderProps>(
  ({ className, value, onValueChange, min = 0, max = 5, step = 0.01, tickCount = 41 }, ref) => {
    
    const currentValue = value[0] ?? min;
    const [isDragging, setIsDragging] = React.useState(false);
    
    const startX = React.useRef(0);
    const startValue = React.useRef(0);

    const PIXELS_PER_TICK = 8; 
    const trackWidth = (tickCount - 1) * PIXELS_PER_TICK;
    const pixelsPerUnit = trackWidth / (max - min);

    const offset = -((currentValue - min) * pixelsPerUnit);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      startX.current = e.clientX;
      startValue.current = currentValue;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX.current;
      let newValue = startValue.current - (deltaX / pixelsPerUnit);
      
      newValue = Math.max(min, Math.min(max, newValue));
      
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }
      
      onValueChange([newValue]);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center py-8 cursor-grab active:cursor-grabbing overflow-hidden',
          className
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-1.5 rounded-full bg-[#f85149] shadow-md z-10 pointer-events-none ring-1 ring-[#f85149] ring-offset-1 ring-offset-transparent" />

        <div className="absolute left-1/2 -top-2 -translate-x-1/2 z-20 pointer-events-none pb-1">
          <NumberFlow
            willChange
            value={currentValue}
            isolate
            className="text-black text-sm font-bold"
            format={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
            opacityTiming={{ duration: 250, easing: 'ease-out' }}
            transformTiming={{ duration: 500 }}
          />
        </div>

        <div className="relative h-6 w-full flex items-center pointer-events-none">
          <div
            className="absolute left-1/2 h-full flex items-center transition-none"
            style={{
              transform: `translateX(${offset}px)`,
              width: `${trackWidth}px`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-between">
              {Array.from({ length: tickCount }).map((_, i) => {
                const isMajorTick = i % 5 === 0;
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-[1.5px] rounded-full",
                      isMajorTick ? "h-3.5 bg-black" : "h-2 bg-neutral-700" 
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    );
  }
);
DualRangeSlider.displayName = 'DualRangeSlider';

export { DualRangeSlider };