import { AboutUsSection } from "@/components/aboutus-section/AboutUs";
import FAQ from "@/components/faq-section/FAQ";
import Features from "@/components/features-section/features";
import Hero from "@/components/hero-section/hero";
import NavbarDemo from "@/components/nav-section/navbar";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"; // Make sure to install react-icons

export default function Home() {
  return (
    <div className="items-center justify-center bg-[#f7f7f7]" dir="ltr">

      <header className="sticky top-0 z-999">
        <NavbarDemo />
      </header>

      <div className="w-full px-2 md:px-10 py-10 rounded-2xl overflow-hidden">
        <Hero />
      </div>

      <section>
        <Features />
      </section>

      <section className="w-full px-2 md:px-10 py-10 rounded-2xl">
        <FAQ />
      </section>

      <section>
        <footer>
          <div className="w-full h-full">
            
            <div className="relative z-10 bg-[#f7f7f7] shadow-2xl rounded-b-3xl">
              <AboutUsSection />
            </div>

            <div className="sticky z-0 bottom-0 left-0 px-2 md:px-10 pb-10 pt-4">
              <div className="relative w-full min-h-[500px] bg-black flex flex-col justify-between px-8 md:px-16 py-12 rounded-3xl overflow-hidden text-[#fcfcfc]">
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                  
                  <div className="space-y-4">
                    <div className="flex items-center ">
                      <img src="/logo.png" alt="" className="h-22 grayscale scale-x-[-1] "/>
                    </div>
                    <p className="max-w-xs text-neutral-400 text-sm leading-relaxed">
                      A graduation project by FCIT students at King Abdulaziz University. 
                      Predicting Alzheimer's progression with multimodal deep learning.
                    </p>
                  </div>

                  <div className="flex gap-16">
                    <div>
                        <h4 className="font-bold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-neutral-400 text-sm">
                            <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Methodology</li>
                            <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Data Sources</li>
                            <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Clinical Trials</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Connect</h4>
                        <ul className="space-y-2 text-neutral-400 text-sm">
                            <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2"><FaGithub/> Github</li>
                            <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2"><FaLinkedin/> LinkedIn</li>
                            <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2"><FaTwitter/> Twitter</li>
                        </ul>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-20">
                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                        <span className="text-xs text-neutral-500">
                            © 2025 KAU FCIT Team. All rights reserved.
                        </span>
                        <span className="text-xs text-neutral-500">
                           Privacy Policy • Terms
                        </span>
                    </div>

                    <h2 className="text-[12vw] text-center leading-[0.8] font-bold tracking-tighter text-white/10 mt-4 select-none pointer-events-none">
                      Neurocast.
                    </h2>
                </div>

              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}