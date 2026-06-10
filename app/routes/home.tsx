import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "~/home.css";

gsap.registerPlugin(ScrollTrigger);

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "CV WIZARD — AI-POWERED RESUME INTELLIGENCE" },
    {
      name: "description",
      content:
        "Precision-engineered resume analysis. Upload. Analyze. Dominate.",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Animated Grid Background                                           */
/* ------------------------------------------------------------------ */
function GridBackground() {
  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-bg__lines" />
      <div className="grid-bg__glow grid-bg__glow--1" />
      <div className="grid-bg__glow grid-bg__glow--2" />
      <div className="grid-bg__glow grid-bg__glow--3" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable M-Stripe Divider                                         */
/* ------------------------------------------------------------------ */
function MStripe({ className = "" }: { className?: string }) {
  return (
    <div className={`m-stripe ${className}`}>
      <div className="m-stripe__blue-light" />
      <div className="m-stripe__blue-dark" />
      <div className="m-stripe__red" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating particles canvas                                          */
/* ------------------------------------------------------------------ */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      baseOpacity: number;
    }[] = [];

    const colors = ["#0066b1", "#1c69d4", "#e22718", "#ffffff", "#4a90d9"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3;
    };

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    };

    const createParticles = () => {
      const count = Math.min(80, Math.floor(window.innerWidth / 20));
      for (let i = 0; i < count; i++) {
        const baseOpacity = Math.random() * 0.5 + 0.1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 0.5,
          opacity: baseOpacity,
          baseOpacity,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse interaction — particles glow near cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactRadius = 200;
        if (dist < interactRadius) {
          p.opacity = p.baseOpacity + (1 - dist / interactRadius) * 0.5;
          const force = (1 - dist / interactRadius) * 0.3;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach((p2, j) => {
          if (j <= i) return;
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - ddist / 140) * 0.1;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(drawParticles);
    };

    resize();
    createParticles();
    drawParticles();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="home-particles"
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                    */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numericPart = parseInt(value.replace(/[^0-9]/g, ""));
  const prefix = value.replace(/[0-9]/g, "").replace(suffix, "");
  const isNumeric = !isNaN(numericPart) && numericPart > 0;

  useEffect(() => {
    if (!ref.current || !isNumeric) return;
    const el = ref.current;
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: numericPart,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.floor(obj.val)}${suffix}`;
        },
      });
    });
    return () => ctx.revert();
  }, [numericPart, prefix, suffix, isNumeric]);

  return <span ref={ref} className="stat-item__value">{value}</span>;
}

/* ------------------------------------------------------------------ */
/*  Main Home Component                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Refs for GSAP
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const resumeGridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  /* ---- GSAP Master Timeline ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // M-Stripe reveal
      if (stripeRef.current) {
        tl.fromTo(
          stripeRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.2 },
          0
        );
      }

      // Headline character-split animation
      if (headlineRef.current) {
        const text = headlineRef.current.getAttribute("data-text") || "CV WIZARD";
        headlineRef.current.innerHTML = "";
        
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        
        const chars = text.trim().split("");
        const charElements: HTMLSpanElement[] = [];
        
        // "CV" part
        const cvChars = chars.slice(0, 2);
        cvChars.forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.textContent = char;
          charSpan.style.opacity = "0";
          charSpan.style.display = "inline-block";
          charSpan.className = "hero-char";
          wrapper.appendChild(charSpan);
          charElements.push(charSpan);
        });

        // Space between CV and WIZARD
        const spacer = document.createElement("span");
        spacer.style.display = "inline-block";
        spacer.style.width = "0.35em";
        wrapper.appendChild(spacer);

        // "WIZARD" part — each char wrapped for width-collapse
        const wizardText = chars.slice(3);
        const wizardCharElements: HTMLSpanElement[] = [];
        const wizardWrappers: HTMLSpanElement[] = [];
        wizardText.forEach((char) => {
          // Outer wrapper controls width collapse
          const outerSpan = document.createElement("span");
          outerSpan.style.display = "inline-block";
          outerSpan.style.overflow = "hidden";
          outerSpan.style.whiteSpace = "nowrap";
          // Inner span holds the character
          const charSpan = document.createElement("span");
          charSpan.textContent = char;
          charSpan.style.opacity = "0";
          charSpan.style.display = "inline-block";
          charSpan.className = "hero-char";
          outerSpan.appendChild(charSpan);
          wrapper.appendChild(outerSpan);
          charElements.push(charSpan);
          wizardCharElements.push(charSpan);
          wizardWrappers.push(outerSpan);
        });
        
        // Animated cursor bar
        const cursor = document.createElement("span");
        cursor.style.display = "inline-block";
        cursor.style.width = "4px";
        cursor.style.height = "0.85em";
        cursor.style.backgroundColor = "#e22718";
        cursor.style.marginLeft = "2px";
        cursor.style.verticalAlign = "middle";
        cursor.style.transformOrigin = "bottom center";
        cursor.style.transform = "scaleY(0)";
        cursor.style.flexShrink = "0";
        wrapper.appendChild(cursor);

        headlineRef.current.appendChild(wrapper);

        // Phase 1: Cursor draws itself in
        tl.to(cursor, {
          scaleY: 1,
          duration: 0.4,
          ease: "power2.out",
        }, 0.2);

        // Phase 2: Type all characters one by one
        tl.to(charElements, {
            opacity: 1,
            duration: 0.01,
            stagger: 0.1,
            ease: "steps(1)",
        }, 0.5);

        // Phase 3: After initial type, start the blink + erase/retype loop
        tl.call(() => {
            // Cursor blink animation (pauses during erase/retype)
            const blinkTween = gsap.to(cursor, {
                opacity: 0,
                duration: 0.53,
                repeat: -1,
                yoyo: true,
                ease: "steps(1)",
            });

            // Erase/retype loop for "WIZARD" only — long pause between cycles
            const loopTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });

            // Stop blinking during erase
            loopTl.call(() => { blinkTween.pause(); gsap.set(cursor, { opacity: 1 }); });

            // Erase WIZARD backward — each step hides char THEN collapses width
            const reversed = wizardCharElements.slice().reverse();
            const reversedWrappers = wizardWrappers.slice().reverse();
            reversed.forEach((charEl, i) => {
                const wrapperEl = reversedWrappers[i];
                // Hide the character
                loopTl.set(charEl, { opacity: 0 }, `erase+=${i * 0.18}`);
                // Collapse the wrapper width so cursor moves left
                loopTl.to(wrapperEl, {
                    width: 0,
                    duration: 0.08,
                    ease: "power1.in",
                }, `erase+=${i * 0.18}`);
            });

            // Cursor erases itself after all chars gone
            loopTl.to(cursor, {
                scaleY: 0,
                duration: 0.3,
                ease: "power2.in",
            }, `erase+=${reversed.length * 0.18 + 0.1}`);

            // Pause while empty
            loopTl.to({}, { duration: 0.6 });

            // Cursor reappears
            loopTl.to(cursor, {
                scaleY: 1,
                duration: 0.3,
                ease: "power2.out",
            });

            // Resume blinking
            loopTl.call(() => { blinkTween.play(); });

            // Retype WIZARD forward — expand width first, then show char
            wizardCharElements.forEach((charEl, i) => {
                const wrapperEl = wizardWrappers[i];
                // Expand wrapper back to auto width
                loopTl.set(wrapperEl, { width: "auto" }, `type+=${i * 0.15}`);
                // Show the character
                loopTl.set(charEl, { opacity: 1 }, `type+=${i * 0.15}`);
            });
        }, [], "+=0.8");
      }

      // Subhead slide up
      if (subheadRef.current) {
        tl.fromTo(
          subheadRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          1.0
        );
      }

      // CTA buttons
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          1.3
        );
      }

      // "How It Works" section
      if (howRef.current) {
        gsap.fromTo(
          howRef.current.querySelectorAll(".how-step"),
          { y: 80, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: howRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate the connecting lines
        gsap.fromTo(
          howRef.current.querySelectorAll(".how-connector"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: howRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Features section scroll trigger
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.querySelectorAll(".feature-card"),
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Stats counter animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll(".stat-item"),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Trust section
      if (trustRef.current) {
        gsap.fromTo(
          trustRef.current.querySelectorAll(".trust-item"),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trustRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Resume grid stagger
      if (resumeGridRef.current) {
        gsap.fromTo(
          resumeGridRef.current.querySelectorAll(".resume-card-wrap"),
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: resumeGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Empty state animation
      if (emptyRef.current) {
        gsap.fromTo(
          emptyRef.current,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: emptyRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [loadingResumes, resumes]);

  return (
    <main className="home-page">
      {/* Animated grid background */}
      <GridBackground />

      {/* Particle background */}
      <ParticleField />

      {/* Navbar */}
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="home-hero" ref={heroRef}>
        {/* Ambient glow effects */}
        <div className="home-hero__glow home-hero__glow--blue" />
        <div className="home-hero__glow home-hero__glow--red" />
        <div className="home-hero__glow home-hero__glow--center" />

        <div className="home-hero__content">
          {/* M-Stripe */}
          <div ref={stripeRef}>
            <MStripe className="home-hero__stripe" />
          </div>

          {/* Badge */}
          <div className="home-hero__badge">
            <span className="home-hero__badge-dot" />
            <span className="home-hero__badge-text">AI-POWERED RESUME ENGINE</span>
          </div>

          {/* Headline */}
          <h1 ref={headlineRef} className="home-hero__headline" data-text="CV WIZARD">
            CV WIZARD
          </h1>

          {/* Subheadline */}
          <p ref={subheadRef} className="home-hero__sub">
            Upload your resume. Get instant AI-powered feedback.
            <br />
            <span className="home-hero__sub-highlight">Dominate your next interview.</span>
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="home-hero__cta">
            <Link to="/upload" className="btn-primary" id="hero-upload-btn">
              <span className="btn-primary__text">UPLOAD RESUME</span>
              <svg
                className="btn-primary__arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <a href="#resumes-section" className="btn-outline" id="hero-explore-btn">
              <span>EXPLORE ANALYSIS</span>
            </a>
          </div>

          {/* Status badges */}
          <div className="home-hero__badges">
            <div className="status-badge">
              <span className="status-badge__dot status-badge__dot--blue" />
              <span className="status-badge__label">AI POWERED</span>
            </div>
            <div className="status-badge__divider" />
            <div className="status-badge">
              <span className="status-badge__dot status-badge__dot--red" />
              <span className="status-badge__label">REAL-TIME</span>
            </div>
            <div className="status-badge__divider" />
            <div className="status-badge">
              <span className="status-badge__dot status-badge__dot--white" />
              <span className="status-badge__label">100% FREE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="home-how" ref={howRef}>
        <div className="home-how__header">
          <span className="section-label">WORKFLOW</span>
          <h2 className="section-headline">HOW IT WORKS</h2>
        </div>

        <div className="home-how__steps">
          {[
            {
              num: "01",
              title: "UPLOAD",
              desc: "Drop your PDF resume into our secure uploader. We handle the rest.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              ),
            },
            {
              num: "02",
              title: "ANALYZE",
              desc: "Our AI engine scans every section — format, content, ATS keywords, and impact.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              ),
            },
            {
              num: "03",
              title: "DOMINATE",
              desc: "Apply actionable suggestions and land your dream role with confidence.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              ),
            },
          ].map((step, i) => (
            <div key={i} className="how-step-container">
              <div className="how-step">
                <div className="how-step__num">{step.num}</div>
                <div className="how-step__icon">{step.icon}</div>
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__desc">{step.desc}</p>
                <div className="how-step__stripe">
                  <MStripe />
                </div>
              </div>
              {i < 2 && <div className="how-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ===== M-STRIPE DIVIDER ===== */}
      <MStripe className="section-stripe" />

      {/* ===== FEATURES SECTION ===== */}
      <section className="home-features" ref={featuresRef}>
        <div className="home-features__header">
          <span className="section-label">CAPABILITIES</span>
          <h2 className="section-headline">ENGINEERED FOR PRECISION</h2>
          <p className="section-body">
            Every metric, every keyword, every formatting detail — analyzed and scored by our AI.
          </p>
        </div>

        <div className="home-features__grid">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              ),
              title: "DEEP ANALYSIS",
              desc: "AI-driven parsing of every resume section — format, content, impact, and readability scored in seconds.",
              num: "01",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              title: "ATS OPTIMIZATION",
              desc: "Keyword matching against applicant tracking systems. Know exactly where your resume stands.",
              num: "02",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
              title: "SMART SUGGESTIONS",
              desc: "Actionable improvement tips tailored to your target role. Every recommendation is implementable.",
              num: "03",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              ),
              title: "FORMAT SCORING",
              desc: "Layout, spacing, font consistency, and visual hierarchy — scored against industry best practices.",
              num: "04",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: "INSTANT RESULTS",
              desc: "Full analysis in under 30 seconds. No waiting, no queues. Upload and get feedback immediately.",
              num: "05",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "PRIVACY FIRST",
              desc: "Your data stays yours. Resumes are processed securely and never shared with third parties.",
              num: "06",
            },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-card__num">{feature.num}</div>
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
              <div className="feature-card__stripe">
                <MStripe />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="home-stats" ref={statsRef}>
        <div className="home-stats__inner">
          {[
            { value: "98", suffix: "%", label: "ACCURACY RATE" },
            { value: "3", suffix: "s", label: "ANALYSIS TIME", prefix: "<" },
            { value: "50", suffix: "+", label: "METRICS CHECKED" },
            { value: "∞", suffix: "", label: "UPLOADS FREE" },
          ].map((stat, i) => (
            <div key={i} className="stat-item">
              {stat.value === "∞" ? (
                <span className="stat-item__value">{stat.value}</span>
              ) : (
                <AnimatedCounter value={`${stat.prefix || ""}${stat.value}`} suffix={stat.suffix} />
              )}
              <span className="stat-item__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className="home-trust" ref={trustRef}>
        <div className="home-trust__inner">
          {[
            { icon: "🔒", label: "END-TO-END ENCRYPTED" },
            { icon: "⚡", label: "BLAZING FAST AI" },
            { icon: "🎯", label: "PRECISION FEEDBACK" },
            { icon: "🆓", label: "FOREVER FREE" },
            { icon: "🌍", label: "WORKS WORLDWIDE" },
          ].map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-item__icon">{item.icon}</span>
              <span className="trust-item__label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== M-STRIPE DIVIDER ===== */}
      <MStripe className="section-stripe" />

      {/* ===== RESUMES SECTION ===== */}
      <section className="home-resumes" id="resumes-section">
        <div className="home-resumes__header">
          <span className="section-label">YOUR PORTFOLIO</span>
          <h2 className="section-headline">
            {!loadingResumes && resumes?.length === 0
              ? "BEGIN YOUR JOURNEY"
              : "YOUR RESUME ANALYSES"}
          </h2>
          <p className="section-body">
            {!loadingResumes && resumes?.length === 0
              ? "Upload your first resume to receive AI-powered precision feedback."
              : "Review your submissions and explore detailed AI feedback."}
          </p>
        </div>

        {/* Loading state */}
        {loadingResumes && (
          <div className="home-loader">
            <div className="home-loader__ring">
              <div className="home-loader__ring-inner" />
            </div>
            <p className="home-loader__text">ANALYZING PORTFOLIO...</p>
            <MStripe className="home-loader__stripe" />
          </div>
        )}

        {/* Resume cards */}
        {!loadingResumes && resumes.length > 0 && (
          <div
            className="home-resumes__grid"
            ref={resumeGridRef}
          >
            {resumes.map((resume, index) => (
              <div key={resume.id} className="resume-card-wrap">
                <ResumeCard resume={resume} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="home-empty" ref={emptyRef}>
            <div className="home-empty__card">
              {/* Glow effect */}
              <div className="home-empty__glow" />

              {/* Icon */}
              <div className="home-empty__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <h3 className="home-empty__title">READY TO LAUNCH</h3>
              <p className="home-empty__desc">
                Upload your resume and get precision analysis in seconds. Our AI
                evaluates formatting, content quality, ATS compatibility, and
                delivers actionable improvement recommendations.
              </p>

              <MStripe className="home-empty__stripe" />

              <Link
                to="/upload"
                className="btn-primary btn-primary--lg"
                id="empty-upload-btn"
              >
                <span className="btn-primary__text">UPLOAD YOUR FIRST RESUME</span>
                <svg
                  className="btn-primary__arrow"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="home-cta-banner">
        <div className="home-cta-banner__inner">
          <MStripe className="home-cta-banner__stripe" />
          <h2 className="home-cta-banner__headline">READY TO OPTIMIZE YOUR CAREER?</h2>
          <p className="home-cta-banner__sub">
            Join thousands who've improved their resumes with CV Wizard's AI-powered analysis.
          </p>
          <Link to="/upload" className="btn-primary btn-primary--lg" id="cta-banner-btn">
            <span className="btn-primary__text">GET STARTED NOW</span>
            <svg className="btn-primary__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">
        <MStripe className="home-footer__stripe" />
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <span className="home-footer__logo">CV WIZARD</span>
            <span className="home-footer__copy">
              © {new Date().getFullYear()} — AI-Powered Resume Intelligence
            </span>
          </div>
          <div className="home-footer__links">
            <Link to="/upload" className="home-footer__link">UPLOAD</Link>
            <Link to="/auth" className="home-footer__link">ACCOUNT</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}