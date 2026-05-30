import React from "react";
import { ImageZoom } from "../ui/ImageZoom";
import Image from "next/image";

function HowItsWork() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fc] py-32">
      {/* Background geometry */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#112069]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#367c66]/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-[#112069]/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* ── Hero Header ── */}
        <div className="mb-28">

          <h2
            className="mt-4 max-w-3xl text-5xl font-black leading-[1.1] tracking-tight text-[#112069]"
            style={{ fontFeatureSettings: '"ss01"' }}
          >
            Advanced Technology
            <br />
            <span className="relative inline-block">
              for a Clearer Future.
              <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#367c66] to-[#112069]/30" />
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#367c66]">
            Harnessing the power of Artificial Intelligence to detect subtle
            patterns in cognitive health. Our deep learning models transform
            complex medical data into actionable insights, offering a proactive
            approach to Alzheimer&apos;s risk assessment and management.
          </p>
        </div>

        {/* ── Section 1: Real-Time Progression ── */}
        <div className="mb-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Image card */}
          <div className="group relative">
            {/* Decorative offset frame */}
            <div className="absolute -inset-3 rounded-[2rem] border border-[#112069]/15 bg-white/40" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#112069]/10 bg-white shadow-2xl shadow-[#112069]/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#112069]/5 via-transparent to-[#367c66]/5" />
              <div className="flex h-80 items-center justify-center p-8">
                <ImageZoom zoomMargin={10}>
                  <Image
                    src="/Real-Time.png"
                    className="h-auto w-full max-w-sm transition-transform duration-500 group-hover:scale-105"
                    height={800}
                    unoptimized
                    width={1200}
                    alt="Real-Time Progression Forecasting visualization"
                  />
                </ImageZoom>
              </div>
              {/* Bottom badge */}
              <div className="border-t border-[#112069]/10 bg-[#112069]/3 px-6 py-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#112069]/50">
                  Longitudinal Analysis Engine
                </span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#112069] text-white text-sm font-bold shadow-lg shadow-[#112069]/30">
                01
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#112069]/30 to-transparent" />
            </div>

            <h3 className="text-4xl font-extrabold leading-tight tracking-tight text-[#112069]">
              Real-Time Progression
              <br />
              <span className="text-[#367c66]">Forecasting</span>
            </h3>

            <p className="text-base font-light leading-relaxed text-gray-600">
              Unlike standard assessments that provide a single snapshot, our
              model incorporates longitudinal data to predict individual decline
              trajectories. We analyze changes in cognitive scores over time to
              forecast future disease stages with high precision.
            </p>

            {/* Metric chips */}
            <div className="mt-2 flex flex-wrap gap-3">
              {[
                { label: "MMSE Scoring", color: "bg-[#112069]/8 text-[#112069]" },
                { label: "CDR Tracking", color: "bg-[#367c66]/10 text-[#367c66]" },
                { label: "Decline Trajectory", color: "bg-[#112069]/8 text-[#112069]" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold ${chip.color}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mb-32 flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#112069]/15 to-transparent" />
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#112069]/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#367c66]/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#112069]/30" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#112069]/15 to-transparent" />
        </div>

        {/* ── Section 2: Multimodal Data Fusion ── */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Text — left on desktop */}
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#367c66] text-white text-sm font-bold shadow-lg shadow-[#367c66]/30">
                02
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#367c66]/30 to-transparent" />
            </div>

            <h3 className="text-4xl font-extrabold leading-tight tracking-tight text-[#112069]">
              Multimodal
              <br />
              <span className="text-[#367c66]">Data Fusion</span>
            </h3>

            <p className="text-base font-light leading-relaxed text-gray-600">
              Our architecture doesn&apos;t rely on a single source. It fuses
              diverse clinical data points to create a holistic view of patient
              health across multiple dimensions simultaneously.
            </p>

            {/* Feature cards */}
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                {
                  icon: "🧬",
                  title: "Genetic Factors",
                  desc: "APOE ε4 & Family History",
                  accent: "#112069",
                },
                {
                  icon: "📝",
                  title: "Clinical NLP",
                  desc: "Symptom extraction from notes",
                  accent: "#367c66",
                },
                {
                  icon: "🧠",
                  title: "Neuroimaging",
                  desc: "MRI & PET scan analysis",
                  accent: "#367c66",
                },
                {
                  icon: "📊",
                  title: "Biomarkers",
                  desc: "CSF & blood protein levels",
                  accent: "#112069",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#112069]/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-[#112069]/10"
                >
                  <div
                    className="absolute right-0 top-0 h-16 w-16 rounded-bl-[2rem] opacity-5"
                    style={{ background: card.accent }}
                  />
                  <div className="mb-3 text-2xl">{card.icon}</div>
                  <div
                    className="mb-1 text-sm font-bold"
                    style={{ color: card.accent }}
                  >
                    {card.title}
                  </div>
                  <div className="text-xs leading-relaxed text-gray-500">
                    {card.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image — right on desktop */}
          <div className="group relative order-1 lg:order-2">
            <div className="absolute -inset-3 rounded-[2rem] border border-[#367c66]/15 bg-white/40" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#112069]/10 bg-white shadow-2xl shadow-[#112069]/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#367c66]/5 via-transparent to-[#112069]/5" />
              <div className="flex h-80 items-center justify-center p-8">
                <ImageZoom zoomMargin={10}>
                  <Image
                    src="/MultimodelData.png"
                    className="h-auto w-full max-w-sm transition-transform duration-500 group-hover:scale-105"
                    height={800}
                    unoptimized
                    width={1200}
                    alt="Multimodal Data Fusion architecture diagram"
                  />
                </ImageZoom>
              </div>
              <div className="border-t border-[#112069]/10 bg-[#367c66]/3 px-6 py-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#367c66]/60">
                  Holistic Patient Modeling
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItsWork;