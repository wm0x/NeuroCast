/* eslint-disable @next/next/no-img-element */
import { AboutUsSection } from "@/components/aboutus-section/AboutUs";
import FAQ from "@/components/faq-section/FAQ";
import Features from "@/components/features-section/features";
import FooterSection from "@/components/footer-section/Footer";
import Hero from "@/components/hero-section/hero";
import NavbarDemo from "@/components/nav-section/navbar";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Home() {
  return (
    <div className="items-center justify-center bg-[#f7f7f7]" dir="ltr">
      <header className="sticky top-0 z-40">
        <NavbarDemo />
      </header>

      <div
        className="w-full px-2 md:px-10 py-10 rounded-2xl overflow-hidden"
        id="home"
      >
        <Hero />
      </div>

      <section id="features">
        <Features />
      </section>

      <section className="w-full px-2 md:px-10 py-10 rounded-2xl" id="faq">
        <FAQ />
      </section>

      <section>
        <footer>
        <FooterSection/>
        </footer>
      </section>
    </div>
  );
}
