import React from "react";
import { ImageZoom } from "../ui/ImageZoom";
import Image from "next/image";

function Features() {
  return (
    <div className="px-10 py-20 max-w-7xl mx-auto">
      <div className="text-4xl font-black mb-24 text-[#112069]">
        Advanced Technology for a Clearer Future.{" "}
        <span className="flex text-lg font-light max-w-4xl mt-4 text-[#367c66] leading-relaxed">
          Harnessing the power of Artificial Intelligence to detect subtle
          patterns in cognitive health. Our deep learning models transform
          complex medical data into actionable insights, offering a proactive
          approach to Alzheimer&apos;s risk assessment and management.
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
          <h3 className="text-3xl font-bold text-[#1f3ca3]">
            Real-Time Progression Forecasting
          </h3>
          <p className="text-xl font-light text-[#367c66] leading-relaxed">
            Unlike standard assessments that provide a single snapshot, our
            model incorporates longitudinal data to predict individual decline
            trajectories. We analyze changes in cognitive scores (MMSE, CDR)
            over time to forecast future disease stages with high
            precision.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row mt-32 items-center justify-center gap-16">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h3 className="text-3xl font-bold text-[#1f3ca3]">
            Multimodal Data Fusion
          </h3>
          <p className="text-xl font-light text-[#367c66] leading-relaxed">
            Our architecture doesn&apos;t rely on a single source. It fuses diverse
            clinical data points to create a holistic view of patient health:
          </p>

          <div className="flex flex-row gap-2 mt-2 border p-1 rounded-xl shadow-xl border-[#112069]/20 shadow-[#112069]/10">
            <div className="flex-1 p-6 rounded-2xl border transition-colors shadow hover:bg-[#112069]/5 border-[#112069]/10">
              <div className="text-2xl mb-2">🧬</div>
              <div className="font-bold text-[#1f3ca3]">Genetic Factors</div>
              <div className="text-sm text-[#367c66] mt-1">
                APOE ε4 & Family History 
              </div>
            </div>
            <div className="flex-1 p-6 rounded-2xl border transition-colors shadow hover:bg-[#112069]/5 border-[#112069]/10">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-bold text-[#1f3ca3]">Clinical NLP</div>
              <div className="text-sm text-[#367c66] mt-1">
                Symptom extraction from notes 
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-96 border rounded-3xl flex items-center justify-center relative overflow-hidden border-[#112069]/20">
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