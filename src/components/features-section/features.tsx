import React from "react";
import { ImageZoom } from "../ui/ImageZoom";
import Image from "next/image";

function Features() {
  return (
    <div className="px-10 py-20 max-w-7xl mx-auto">
      <div className="text-4xl font-black mb-24">
        Advanced Technology for a Clearer Future.{" "}
        <span className="flex text-lg font-light max-w-4xl mt-4 text-neutral-400 leading-relaxed">
          Harnessing the power of Artificial Intelligence to detect subtle
          patterns in cognitive health. Our deep learning models transform
          complex medical data into actionable insights, offering a proactive
          approach to Alzheimer's risk assessment and management[cite: 3].
        </span>
      </div>

      <div className="flex flex-col lg:flex-row mt-20 items-center justify-center gap-16">
        <div className="w-full lg:w-1/2 h-96 rounded-3xl flex items-center justify-center relative overflow-hidden group">
          <ImageZoom zoomMargin={10}>
            <Image
              src="/Real-Time.png"
              className="h-auto w-96"
              height={800}
              unoptimized
              width={1200}
              alt={""}
            ></Image>
          </ImageZoom>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <h3 className="text-3xl font-bold text-black">
            Real-Time Progression Forecasting
          </h3>
          <p className="text-xl font-light text-neutral-400 leading-relaxed">
            Unlike standard assessments that provide a single snapshot, our
            model incorporates longitudinal data to predict individual decline
            trajectories. We analyze changes in cognitive scores (MMSE, CDR)
            over time to forecast future disease stages with high
            precision[cite: 6, 25, 50].
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row mt-32 items-center justify-center gap-16">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h3 className="text-3xl font-bold text-black">
            Multimodal Data Fusion
          </h3>
          <p className="text-xl font-light text-neutral-400 leading-relaxed">
            Our architecture doesn't rely on a single source. It fuses diverse
            clinical data points to create a holistic view of patient health:
          </p>

          <div className="flex flex-row gap-2 mt-2 border p-1 rounded-xl shadow-xl ">
            <div className="flex-1 p-6 rounded-2xl border transition-colors shadow hover:bg-black/5">
              <div className="text-2xl mb-2">🧬</div>
              <div className="font-bold text-black">Genetic Factors</div>
              <div className="text-sm text-neutral-500 mt-1">
                APOE ε4 & Family History [cite: 38]
              </div>
            </div>
            <div className="flex-1 p-6 rounded-2xl border transition-colors shadow hover:bg-black/5">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-bold text-black">Clinical NLP</div>
              <div className="text-sm text-neutral-500 mt-1">
                Symptom extraction from notes [cite: 63]
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-96  border border-white/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
          <ImageZoom zoomMargin={10}>
            <Image
              src="/MultimodelData.png"
              className="h-auto w-96"
              height={800}
              unoptimized
              width={1200}
              alt={""}
            ></Image>
          </ImageZoom>
        </div>
      </div>
    </div>
  );
}

export default Features;
