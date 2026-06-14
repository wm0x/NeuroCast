"use client";
import { FaGithub } from "react-icons/fa";
import { AboutUsSection } from "../aboutus-section/AboutUs";

const FooterAmbientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
    <div
      className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full opacity-20 blur-[100px]"
      style={{ background: "radial-gradient(circle, #1f3ca3 0%, transparent 65%)" }}
    />
    <div
      className="absolute -top-10 right-10 w-72 h-72 rounded-full opacity-12 blur-[80px]"
      style={{ background: "radial-gradient(circle, #adfa1e 0%, transparent 65%)" }}
    />
    <div
      className="absolute top-0 -left-16 w-80 h-80 rounded-full opacity-12 blur-[90px]"
      style={{ background: "radial-gradient(circle, #ed40b3 0%, transparent 65%)" }}
    />
    <div
      className="absolute -bottom-10 -right-16 w-[28rem] h-[28rem] rounded-full opacity-15 blur-[100px]"
      style={{ background: "radial-gradient(circle, #ff9a1f 0%, transparent 65%)" }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-8 blur-[70px]"
      style={{ background: "radial-gradient(circle, #367c66 0%, transparent 65%)" }}
    />
  </div>
);

const PALETTE = ["#112069", "#1f3ca3", "#367c66", "#adfa1e", "#ffe77a", "#ff9a1f", "#ed40b3"];

const NAV_LINKS = [
  { label: "Methodology", color: "#adfa1e" },
  { label: "Data Sources", color: "#ed40b3" },
  { label: "Clinical Trials", color: "#ff9a1f" },
];

export default function FooterSection() {
  return (
    <section>
      <footer>
        <div className="w-full h-full">
          {/* About Us — light panel */}
          <div
            className="relative z-10 bg-[#f7f7f7] shadow-2xl rounded-b-3xl"
            id="aboutus"
          >
            <AboutUsSection />
          </div>

          {/* Sticky dark footer */}
          <div className="sticky z-0 bottom-0 left-0 px-2 md:px-10 pb-10 pt-4">
            <div className="relative w-full min-h-[500px] bg-[#080a0e] flex flex-col justify-between px-8 md:px-16 py-12 rounded-3xl overflow-hidden text-[#fcfcfc]">

              {/* Grid texture */}
              <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] [background-size:28px_28px]" />

              {/* Noise grain overlay */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-3xl"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                }}
              />

              <FooterAmbientOrbs />

              {/* ── Top content row ── */}
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">

                {/* Brand column */}
                <div className="space-y-5 max-w-xs">
                  <div className="flex items-center">
                    <img
                      src="/logo.png"
                      alt="Neurocast"
                      className="h-22 grayscale scale-x-[-1] opacity-90"
                    />
                  </div>

                  <p className="text-neutral-400 text-sm leading-relaxed">
                    A graduation project by FCIT students at King Abdulaziz
                    University. Predicting Alzheimer&apos;s progression with
                    multimodal deep learning.
                  </p>

                  {/* Animated palette strip */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {PALETTE.map((c, i) => (
                      <div
                        key={c}
                        className="h-0.5 rounded-full transition-all duration-300 hover:h-1 hover:opacity-100"
                        style={{
                          background: c,
                          width: i === 0 ? "28px" : "16px",
                          opacity: 0.45,
                          boxShadow: `0 0 6px 1px ${c}55`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Status badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#adfa1e] opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#adfa1e]" />
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400 tracking-wide">
                      Active Research · 2026
                    </span>
                  </div>
                </div>

                {/* Nav columns */}
                <div className="flex gap-16">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-5">
                      Platform
                    </h4>
                    <ul className="space-y-3">
                      {NAV_LINKS.map(({ label, color }) => (
                        <li key={label}>
                          <a
                            href="#"
                            className="group flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-all duration-200"
                          >
                            <span
                              className="h-px w-4 rounded-full transition-all duration-200 group-hover:w-6"
                              style={{ background: color, boxShadow: `0 0 6px 1px ${color}66` }}
                            />
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-5">
                      Source Code
                    </h4>
                    <ul className="space-y-3">
                      <li>
                        <a
                          href="https://github.com/wm0x/NeuroCast"
                          className="group flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-all duration-200"
                          target="_blank"
                        >
                          <FaGithub
                            className="text-base transition-colors duration-200"
                            style={{ color: "#adfa1e", filter: "drop-shadow(0 0 4px #adfa1e66)" }}
                          />
                          GitHub
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ── Bottom: copyright + giant wordmark ── */}
              <div className="relative z-10 mt-auto pt-16">
                <div
                  className="flex justify-between items-center border-t pb-0 pt-5"
                  style={{ borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <span className="text-[11px] text-neutral-600 tracking-wide">
                    © 2026 KAU FCIT Team. All rights reserved.
                  </span>
                  <div className="flex items-center gap-4 text-[11px] text-neutral-600">
                    <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
                    <span className="opacity-30">·</span>
                    <a href="#" className="hover:text-neutral-400 transition-colors">Terms</a>
                  </div>
                </div>

                {/* Giant wordmark — the hero anchor of the footer */}
                <div className="relative mt-2 overflow-hidden">
                  <h2
                    className="text-[13vw] leading-[0.82] font-black tracking-tighter select-none pointer-events-none text-center"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(255,255,255,0.07)",
                      backgroundImage:
                        "linear-gradient(135deg, rgba(173,250,30,0.12) 0%, rgba(237,64,179,0.08) 40%, rgba(31,60,163,0.12) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      textShadow:
                        "0 0 120px rgba(173,250,30,0.06), 0 0 200px rgba(237,64,179,0.05)",
                    }}
                  >
                    Neurocast.
                  </h2>
                  {/* Subtle horizontal glow under the wordmark */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}