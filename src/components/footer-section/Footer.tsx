"use client";
import { FaGithub } from "react-icons/fa";
import { AboutUsSection } from "../aboutus-section/AboutUs";

/* ── Ambient orbs identical in spirit to the FAQ section ── */
const FooterAmbientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
    {/* Bottom-left — deep blue */}
    <div
      className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, #1f3ca3 0%, transparent 70%)" }}
    />
    {/* Top-right — lime */}
    <div
      className="absolute -top-16 right-24 w-64 h-64 rounded-full opacity-15 blur-3xl"
      style={{ background: "radial-gradient(circle, #adfa1e 0%, transparent 70%)" }}
    />
    {/* Top-left — pink */}
    <div
      className="absolute -top-20 -left-10 w-72 h-72 rounded-full opacity-15 blur-3xl"
      style={{ background: "radial-gradient(circle, #ed40b3 0%, transparent 70%)" }}
    />
    {/* Bottom-right — orange */}
    <div
      className="absolute -bottom-16 -right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
      style={{ background: "radial-gradient(circle, #ff9a1f 0%, transparent 70%)" }}
    />
    {/* Center — teal */}
    <div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full opacity-10 blur-3xl"
      style={{ background: "radial-gradient(circle, #367c66 0%, transparent 70%)" }}
    />
  </div>
);

/* Thin colored accent dots used beside nav links */
const AccentDot = ({ color }: { color: string }) => (
  <span
    className="inline-block w-1 h-1 rounded-full mr-2 opacity-70"
    style={{ background: color, boxShadow: `0 0 4px 1px ${color}88` }}
  />
);

const navColors = ["#adfa1e", "#ed40b3", "#ff9a1f"];

export default function FooterSection() {
  return (
    <section>
      <footer>
        <div className="w-full h-full">
          <div
            className="relative z-10 bg-[#f7f7f7] shadow-2xl rounded-b-3xl"
            id="aboutus"
          >
            <AboutUsSection />
          </div>

          <div className="sticky z-0 bottom-0 left-0 px-2 md:px-10 pb-10 pt-4">
            <div className="relative w-full min-h-[500px] bg-black flex flex-col justify-between px-8 md:px-16 py-12 rounded-3xl overflow-hidden text-[#fcfcfc]">

              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

              <FooterAmbientOrbs />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <img
                      src="/logo.png"
                      alt=""
                      className="h-22 grayscale scale-x-[-1]"
                    />
                  </div>
                  <p className="max-w-xs text-neutral-400 text-sm leading-relaxed">
                    A graduation project by FCIT students at King Abdulaziz
                    University. Predicting Alzheimer&apos;s progression with
                    multimodal deep learning.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {["#112069", "#1f3ca3", "#367c66", "#adfa1e", "#ffe77a", "#ff9a1f", "#ed40b3"].map(
                      (c) => (
                        <div
                          key={c}
                          className="h-0.5 w-5 rounded-full opacity-50"
                          style={{ background: c }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="flex gap-16">
                  <div>
                    <h4
                      className="font-bold text-white mb-4"
                      style={{ textShadow: "0 0 20px #adfa1e44" }}
                    >
                      Platform
                    </h4>
                    <ul className="space-y-2 text-neutral-400 text-sm">
                      {["Methodology", "Data Sources", "Clinical Trials"].map(
                        (label, i) => (
                          <li
                            key={label}
                            className="flex items-center hover:text-white hover:translate-x-1 transition-all cursor-pointer"
                          >
                            <AccentDot color={navColors[i]} />
                            {label}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4
                      className="font-bold text-white mb-4"
                      style={{ textShadow: "0 0 20px #ed40b344" }}
                    >
                      Source Code
                    </h4>
                    <ul className="space-y-2 text-neutral-400 text-sm">
                      <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2">
                        <FaGithub
                          style={{ color: "#adfa1e", filter: "drop-shadow(0 0 4px #adfa1e88)" }}
                        />
                        Github
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-20">
                <div className="flex justify-between items-end border-t pt-6"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <span className="text-xs text-neutral-500">
                    © 2025 KAU FCIT Team. All rights reserved.
                  </span>
                  <span className="text-xs text-neutral-500">
                    Privacy Policy • Terms
                  </span>
                </div>

                <h2
                  className="text-[12vw] text-center leading-[0.8] font-bold tracking-tighter mt-4 select-none pointer-events-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                    textShadow:
                      "0 0 80px rgba(173,250,30,0.08), 0 0 160px rgba(237,64,179,0.06)",
                  }}
                >
                  Neurocast.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}