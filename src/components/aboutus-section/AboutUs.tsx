/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef } from "react";
import { TextReveal } from "@/components/ui/text-reveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  el: HTMLDivElement;
  vx: number;
  vy: number;
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: "Ali",
    role: "Leader & Full Stack",
    bio: "Leading the team with vision and technical expertise, building end-to-end solutions.",
    avatar: "/MyFace.jpeg",
  },
  {
    name: "Jasser",
    role: "AI & Deep Learning",
    bio: "Architecting deep learning models to deliver accurate predictive healthcare solutions.",
    avatar: "/JasserFace.png",
  },
  {
    name: "Khalid",
    role: "Data & Systems",
    bio: "Building robust data pipelines and ensuring seamless integration of clinical data.",
    avatar: "/KhalidFace.png",
  },
];
// ─── Bracket ──────────────────────────────────────────────────────────────────

const Bracket = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className}>
    <path fill="#000" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z" />
  </svg>
);

// ─── Magnetic card ────────────────────────────────────────────────────────────

const MagneticCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    gsap.to(el, { rotateY: dx * 12, rotateX: -dy * 12, translateZ: 30, duration: 0.4, ease: "power3.out" });
  };

  const onLeave = () =>
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, translateZ: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
      {children}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const AboutUsSection = () => {
  const sectionRef    = useRef<HTMLElement>(null);
  const heroRef       = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const titleWrapRef  = useRef<HTMLDivElement>(null);
  const orbRef        = useRef<HTMLDivElement>(null);
  const orbit1Ref     = useRef<HTMLDivElement>(null);
  const orbit2Ref     = useRef<HTMLDivElement>(null);
  const gridRef       = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);
  const teamLabelRef  = useRef<HTMLParagraphElement>(null);
  const advisorRef    = useRef<HTMLDivElement>(null);
  const counterRef    = useRef<HTMLSpanElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);

  // ── Canvas Neural Cursor-Trail ──────────────────────────────────────────
  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const particles: Particle[] = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const resize = () => {
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;

      // Magnetic Title Interaction
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll<HTMLSpanElement>("[data-char]");
        chars.forEach((char) => {
          const charRect = char.getBoundingClientRect();
          const charX = charRect.left + charRect.width / 2 - r.left;
          const charY = charRect.top + charRect.height / 2 - r.top;
          
          const dx = (mouseX - charX) / canvas.width;
          const dy = (mouseY - charY) / canvas.height;
          
          gsap.to(char, {
            rotateX: -dy * 40,
            rotateY: dx * 40,
            duration: 0.6,
            ease: "power2.out"
          });
        });
      }

      // Add new particles
      if (Math.random() > 0.3) {
        const div = document.createElement("div");
        div.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;z-index:5;`;
        hero.appendChild(div);
        const size = Math.random() * 4 + 2;
        const p: Particle = {
          el: div,
          x: mouseX + (Math.random() - 0.5) * 20,
          y: mouseY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 0.5,
          life: 0,
          maxLife: Math.random() * 60 + 40,
        };
        gsap.set(div, { x: p.x - size / 2, y: p.y - size / 2, width: size, height: size, background: "#000" });
        particles.push(p);
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        
        // Gentle float upwards
        p.vy -= 0.01;
        
        const prog = p.life / p.maxLife;
        gsap.set(p.el, { x: p.x, y: p.y, opacity: 0.4 * (1 - prog), scale: 1 - prog * 0.5 });
        
        if (p.life >= p.maxLife) {
          p.el.remove();
          particles.splice(i, 1);
        }
      }

      // Neural Network Line Drawing
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,0,0,${0.15 * (1 - dist / 80)})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw faint radial glow at cursor
      const g = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
      g.addColorStop(0, "rgba(0,0,0,0.03)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  // ── GSAP animations ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      // 1 ── Central orb pulse + drift
      if (orbRef.current) {
        gsap.to(orbRef.current, { scale: 1.18, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(orbRef.current, {
          y: -250, ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // 2 ── Orbit rings rotate continuously
      if (orbit1Ref.current) gsap.to(orbit1Ref.current, { rotation: 360, duration: 18, ease: "none", repeat: -1 });
      if (orbit2Ref.current) gsap.to(orbit2Ref.current, { rotation: -360, duration: 26, ease: "none", repeat: -1 });

      // 3 ── Grid lines parallax scrub
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          yPercent: 30, ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 2 },
        });
      }

      // 4 ── Title characters: 3-D tumble in
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll<HTMLSpanElement>("[data-char]");
        const count = chars.length;
        gsap.set(chars, { x: (i) => (i - count / 2) * 80, rotateY: 90, rotateX: 45, opacity: 0, transformOrigin: "50% 50% -100px" });
        
        gsap.to(chars, {
          x: 0, rotateX: 0, rotateY: 0, opacity: 1, duration: 1.5, ease: "expo.out", stagger: 0.04, delay: 0.2,
        });
      }

      // 5 ── Title wrapper scrub up
      if (titleWrapRef.current) {
        gsap.to(titleWrapRef.current, {
          yPercent: -30, ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // 6 ── Scroll hint bob and fade
      if (scrollHintRef.current) {
        gsap.fromTo(scrollHintRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1.5 });
        gsap.to(scrollHintRef.current, { y: 10, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5 });
        gsap.to(scrollHintRef.current, {
          opacity: 0, ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "20% top", scrub: true },
        });
      }

      // 7 ── Divider line draw
      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 1.5, ease: "power4.inOut",
          scrollTrigger: { trigger: dividerRef.current, start: "top 90%" },
        });
      }

      // 8 ── Team label brackets
      if (teamLabelRef.current) {
        const [b0, b1] = teamLabelRef.current.querySelectorAll("svg");
        const span = teamLabelRef.current.querySelector("span");
        const st = { trigger: teamLabelRef.current, start: "top 85%" };
        gsap.fromTo(b0, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1,0.5)", scrollTrigger: st });
        gsap.fromTo(b1, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1,0.5)", delay: 0.1, scrollTrigger: st });
        gsap.fromTo(span, { y: 15, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.15, scrollTrigger: st });
      }

      // 9 ── Advisor card clip-wipe
      if (advisorRef.current) {
        gsap.fromTo(advisorRef.current, { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0, x: -30 }, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, x: 0, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: advisorRef.current, start: "top 85%" },
        });
        
        if (counterRef.current) {
          gsap.to({ val: 0 }, {
            val: 100, duration: 2, delay: 0.5, ease: "expo.out",
            onUpdate: function() { if (counterRef.current) counterRef.current.textContent = `${Math.round(this.targets()[0].val)}%`; },
            scrollTrigger: { trigger: advisorRef.current, start: "top 85%", once: true },
          });
        }
      }

      // 10 ── Team cards Dynamic Cascade
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        
        // Entry animation
        gsap.fromTo(card, { y: 100, opacity: 0, rotateZ: i % 2 === 0 ? -3 : 3, scale: 0.9 }, {
          y: 0, opacity: 1, rotateZ: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.75)", delay: i * 0.15,
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" },
        });

        // Index count-up
        const idx = card.querySelector<HTMLElement>("[data-index]");
        if (idx) {
          gsap.to({ val: 0 }, {
            val: parseInt(idx.dataset.index || "1", 10), duration: 1, delay: i * 0.15 + 0.5, ease: "power3.out",
            onUpdate: function() { idx.textContent = `0${Math.round(this.targets()[0].val)}`; },
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          });
        }

        // Shimmer top-line on hover
        const shimmer = card.querySelector<HTMLElement>("[data-shimmer]");
        if (shimmer) {
          card.addEventListener("mouseenter", () => gsap.fromTo(shimmer, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.5, ease: "expo.out" }));
          card.addEventListener("mouseleave", () => gsap.to(shimmer, { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "expo.in" }));
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const TEXT = "More About Us";

  return (
    <main ref={sectionRef} className="w-full bg-[#f7f7f7] overflow-clip relative">
      <div ref={heroRef} className="relative flex h-screen items-center justify-center overflow-hidden">
        <div ref={gridRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)" }} />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
        
        <div ref={orbRef} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full" style={{ background: "radial-gradient(circle at 40% 35%, rgba(0,0,0,0.08) 0%, transparent 65%)", filter: "blur(2px)" }} />
        <div ref={orbit1Ref} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-black/10" style={{ borderStyle: "dashed" }} />
        <div ref={orbit2Ref} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-black/[0.07]">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/30" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black/20" />
        </div>

        {["top-6 left-6", "top-6 right-6 rotate-90", "bottom-6 left-6 -rotate-90", "bottom-6 right-6 rotate-180"].map((pos, i) => (
          <svg key={i} aria-hidden="true" className={`pointer-events-none absolute ${pos} w-8 h-8 text-black/20`} viewBox="0 0 32 32" fill="none">
            <path d="M0 12V0h12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ))}

        <span aria-hidden="true" className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono uppercase tracking-[0.3em] text-black/25 select-none">
          KAU · FCIT · 2025
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono uppercase tracking-[0.3em] text-black/25 select-none">
          Alzheimer · AI · DeepLearning
        </span>

        <div ref={titleWrapRef} className="relative z-20 flex flex-col items-center gap-6">
          <div ref={titleRef} className="font-geist w-full max-w-4xl text-center text-[clamp(3rem,8vw,6rem)] font-bold uppercase tracking-tighter text-black select-none" style={{ perspective: "600px" }}>
            {TEXT.split("").map((char, i) =>
              char === " " ? (
                <span key={i} className="inline-block w-[0.3em]" aria-hidden="true" />
              ) : (
                <span key={i} data-char className="inline-block" style={{ display: "inline-block", willChange: "transform" }}>
                  {char}
                </span>
              )
            )}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-black/40 select-none">
            CS · King Abdulaziz University
          </p>
        </div>

        <div ref={scrollHintRef} aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 select-none">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-black/40">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-black/30 to-transparent" />
        </div>
      </div>

      <div ref={dividerRef} className="mx-auto h-px w-full max-w-5xl bg-neutral-300" style={{ transformOrigin: "left center" }} />

      <div className="md:-mt-[10vh]">
        <TextReveal>
          We are three Computer Science students from FCIT at King Abdulaziz
          University, united by a mission to transform Alzheimer&apos;s management.
          Our project leverages multimodal deep learning to shift care from
          reactive diagnosis to predictive foresight. By decoding complex
          clinical data into real-time progression forecasts, we empower
          clinicians and families with the clarity needed for proactive planning
          and better quality of life.
        </TextReveal>
      </div>

      <div className="relative flex flex-col items-center gap-5 px-4 py-10 -translate-y-40 md:px-8 lg:px-16">
        <p ref={teamLabelRef} className="font-geist flex items-center gap-2 text-lg font-medium tracking-tight text-neutral-600 md:gap-3 md:text-2xl">
          <Bracket className="h-8 text-black md:h-12" />
          <span className="font-medium">the team</span>
          <Bracket className="h-8 scale-x-[-1] text-black md:h-12" />
        </p>

        <MagneticCard className="w-full max-w-6xl">
          <div ref={advisorRef} className="group w-full overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 shadow-sm transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <div className="absolute inset-0 rounded-xl border-2 border-amber-300 animate-[spin_8s_linear_infinite] opacity-40" />
                <div className="relative z-10 h-full w-full overflow-hidden rounded-xl border-2 border-amber-300/60">
                  <img src="https://scholar.googleusercontent.com/citations?view_op=view_photo&user=ki5_hZoAAAAJ&citpid=2" alt="Dr. Asif" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">Faculty Advisor</span>
                  <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Rigor <span ref={counterRef} className="text-amber-700 tabular-nums">0%</span>
                  </span>
                </div>
                <h3 className="font-geist text-xl font-bold tracking-tight text-black">Dr. Asif</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
                  Providing academic guidance and domain expertise in AI and healthcare systems, ensuring our research meets the highest standards of scientific rigor.
                </p>
              </div>
              <div className="hidden shrink-0 text-2xl md:block">🎓</div>
            </div>
          </div>
        </MagneticCard>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {TEAM.map((member, i) => (
            <MagneticCard key={member.name}>
              <div ref={(el) => { cardRefs.current[i] = el; }} className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm" style={{ transformStyle: "preserve-3d" }}>
                <div data-shimmer className="absolute top-0 left-0 h-[2px] w-full bg-black" style={{ transform: "scaleX(0)", transformOrigin: "left center" }} />
                <span data-index={i + 1} className="absolute top-4 right-4 font-mono text-xs font-bold tracking-widest text-neutral-300 select-none tabular-nums">00</span>
                <div className="relative z-10">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-neutral-50 overflow-hidden">
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="font-geist mb-0.5 text-2xl font-bold tracking-tight text-black">{member.name}</h3>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">{member.role}</p>
                  <p className="font-geist text-sm leading-relaxed text-neutral-600">{member.bio}</p>
                </div>
                <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-neutral-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </main>
  );
};

export { AboutUsSection };