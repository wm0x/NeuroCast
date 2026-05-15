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
  ({ className, value, onValueChange, min = 0, max = 5, step = 0.01, tickCount = 41 }, forwardedRef) => {

    // إنشاء Ref داخلي للتحكم في أحداث اللمس الخاصة بالآيفون
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement);
    
    // --- 1. إصلاح الأداء (Local State) ---
    // يجعل السلايدر يتحرك بـ 60 إطار في الثانية دون انتظار الصفحة الرئيسية
    const [localValue, setLocalValue] = React.useState(value[0] ?? min);
    const [isDragging, setIsDragging] = React.useState(false);

    // مزامنة القيمة مع الأب فقط عندما لا نقوم بالسحب
    React.useEffect(() => {
      if (!isDragging) {
        setLocalValue(value[0] ?? min);
      }
    }, [value, isDragging, min]);

    // --- 2. إصلاح تعليق الآيفون (Safari Touch Fix) ---
    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const preventDefaultTouch = (e: TouchEvent) => {
        if (isDragging) {
          e.preventDefault(); // إيقاف محاولة سفاري لعمل سكرول أو رجوع
        }
      };

      // passive: false ضرورية جداً لكي يعمل e.preventDefault() في سفاري
      el.addEventListener('touchmove', preventDefaultTouch, { passive: false });
      return () => el.removeEventListener('touchmove', preventDefaultTouch);
    }, [isDragging]);

    const startX = React.useRef(0);
    const startValue = React.useRef(0);

    const PIXELS_PER_TICK = 8; 
    const trackWidth = (tickCount - 1) * PIXELS_PER_TICK;
    const pixelsPerUnit = trackWidth / (max - min);

    // استخدام القيمة المحلية لحساب الحركة لضمان استجابة فورية
    const offset = -((localValue - min) * pixelsPerUnit);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      startX.current = e.clientX;
      startValue.current = localValue;
      if (e.currentTarget.setPointerCapture) {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX.current;
      let newValue = startValue.current - (deltaX / pixelsPerUnit);
      
      newValue = Math.max(min, Math.min(max, newValue));
      
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }
      
      setLocalValue(newValue);   // تحديث الواجهة فوراً (بسرعة عالية جداً)
      onValueChange([newValue]); // تحديث الصفحة الرئيسية في الخلفية
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      if (e.currentTarget.releasePointerCapture) {
        try {
          // --- 3. إصلاح خطأ انهيار سفاري ---
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (err) {
          // تجاهل الخطأ إذا كان سفاري قد أفلت المؤشر مسبقاً
        }
      }
    };

    return (
      <div
        ref={containerRef}
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
          WebkitUserSelect: 'none', // منع تحديد النصوص في الآيفون
          touchAction: 'none' // إجبار متصفح الآيفون على تجاهل السحب
        }}
      >
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-1.5 rounded-full bg-[#f85149] shadow-md z-10 pointer-events-none ring-1 ring-[#f85149] ring-offset-1 ring-offset-transparent" />

        <div className="absolute left-1/2 -top-2 -translate-x-1/2 z-20 pointer-events-none pb-1">
          <NumberFlow
            willChange
            value={localValue} // ربط الأرقام بالقيمة المحلية السريعة
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