'use client';

import { DualRangeSlider } from '@/components/ui/slider';
import React, { useState } from 'react';

export default function MotionNumberSlider() {
  const [value, setValue] = useState(2.5);

  return (
    <div className='w-full max-w-sm mx-auto py-8'>
      <div className='bg-transparent px-4 py-4 w-full'>
        <DualRangeSlider
          value={[value]}
          onValueChange={([val]) => val != null && setValue(val)}
          min={0}
          max={5}
          step={0.01}
          tickCount={41} 
        />
      </div>
    </div>
  );
}