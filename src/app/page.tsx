"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);
    const t4 = setTimeout(() => setPhase(4), 4200);
    const t5 = setTimeout(() => onComplete(), 5000);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 48);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="fixed inset-0 aurora" />

      <div className="relative z-10 text-center">
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="text-[#00d4ff] text-xs md:text-sm tracking-[0.5em] uppercase font-mono mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              INITIALIZING CREATIVE ENGINE
            </motion.div>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl md:text-8xl font-bold mb-2">
              <span className="text-gold-gradient glitch-text" data-text="KUNDAI">KUNDAI</span>
            </div>
            <div className="text-5xl md:text-8xl font-bold mb-8">
              <span className="text-neon-gradient">PIXEL</span>
            </div>
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-64 md:w-96 mx-auto"
          >
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00d4ff] via-[#a855f7] to-[#ff006e] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-[#00d4ff] text-xs font-mono">
                {progress}%
              </span>
              <span className="text-white/30 text-xs font-mono">
                LOADING ASSETS...
              </span>
            </div>
          </motion.div>
        )}

        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
            className="text-[#a855f7] text-sm tracking-[0.3em] uppercase font-mono mt-6"
          >
            SYSTEM ONLINE
          </motion.div>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00d4ff]/10 to-transparent" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#a855f7]/10 to-transparent" />
      </div>
    </motion.div>
  );
}

function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 200 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const磁性 = target.closest("[data-magnetic]");
      if (磁性) {
        setIsHovering(true);
        setCursorText((磁性 as HTMLElement).getAttribute("data-magnetic") || "");
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorText("");
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9990] mix-blend-difference hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "white",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9989] border border-[#00d4ff]/50 hidden md:flex items-center justify-center"
        animate={{
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          borderColor: isHovering ? "rgba(0,212,255,0.8)" : "rgba(0,212,255,0.3)",
          background: isHovering ? "rgba(0,212,255,0.05)" : "transparent",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[8px] tracking-widest text-[#00d4ff] uppercase font-mono"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; alpha: number; life: number;
    }[] = [];
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#00d4ff", "#a855f7", "#d4a853", "#ff006e", "#00ff88"];
    const spawn = () => {
      if (particles.length < 200) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2.5 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.6 + 0.1,
          life: Math.random() * 200 + 100,
        });
      }
    };

    for (let i = 0; i < 150; i++) spawn();

    const handleMouse = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.002;

      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(time + i) * 0.2;
        p.y += p.vy + Math.cos(time + i) * 0.2;
        p.life--;

        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = Math.random() * 200 + 100;
          p.alpha = Math.random() * 0.6 + 0.1;
          return;
        }

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          p.vx += dx * 0.00015;
          p.vy += dy * 0.00015;
          p.alpha = Math.min(0.8, p.alpha + 0.01);
        }

        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulse = Math.sin(time * 3 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.5 + pulse * 0.5);
        ctx.fill();

        if (p.size > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.05;
          ctx.fill();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.sqrt(
            (particles[j].x - p.x) ** 2 + (particles[j].y - p.y) ** 2
          );
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const grad = ctx.createLinearGradient(p.x, p.y, particles[j].x, particles[j].y);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, particles[j].color);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = (1 - d / 100) * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="aurora" />
      <div
        className="absolute w-[600px] h-[600px] morphing-blob opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #00d4ff, transparent 70%)",
          top: "5%",
          left: "0%",
          animation: "float-orb 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] morphing-blob opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #a855f7, transparent 70%)",
          bottom: "10%",
          right: "0%",
          animation: "float-orb 12s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] morphing-blob opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #ff006e, transparent 70%)",
          top: "40%",
          left: "40%",
          animation: "float-orb 18s ease-in-out infinite 3s",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] morphing-blob opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #00ff88, transparent 70%)",
          top: "70%",
          left: "20%",
          animation: "float-orb 14s ease-in-out infinite 5s",
        }}
      />
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #00d4ff, #a855f7, #ff006e, #d4a853)",
      }}
    />
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#00d4ff]/30" />
        <div className="w-2 h-2 rotate-45 border border-[#a855f7]/30" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#a855f7]/30" />
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#gallery", label: "Gallery" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "glass py-3" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#home"
          className="text-2xl font-bold tracking-wider"
          whileHover={{ scale: 1.05 }}
          data-magnetic="HOME"
        >
          <span className="text-gold-gradient">KUNDAI</span>
          <span className="text-white/80 ml-1">PIXEL</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative text-sm tracking-widest text-white/50 hover:text-white transition-colors duration-300 uppercase group font-mono"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              data-magnetic={link.label.toUpperCase()}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        <button
          className="md:hidden text-[#00d4ff] cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6L18 18M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="text-sm tracking-widest text-white/50 hover:text-[#00d4ff] transition-colors uppercase font-mono" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.5, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.3], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image src="/images/hero-wide.webp" alt="Kundai Pixel Creative Studio" fill className="object-cover" priority sizes="100vw" />
        <motion.div className="absolute inset-0" style={{ opacity: overlayOpacity }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#050505]/70 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/8 via-transparent to-[#a855f7]/8" />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
        }} />
      </div>

      <motion.div style={{ y: textY }} className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 5.2 }}>
          <motion.div
            className="inline-block mb-8 px-5 py-2 border border-[#00d4ff]/20 rounded-full relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 5.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 to-[#a855f7]/5" />
            <span className="relative text-[#00d4ff] text-xs md:text-sm tracking-[0.4em] uppercase font-mono">
              &lt;CREATIVE_STUDIO /&gt;
            </span>
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.h1
              className="text-8xl md:text-[10rem] lg:text-[14rem] font-black leading-[0.85]"
              initial={{ y: 300, rotateX: -80 }}
              animate={{ y: 0, rotateX: 0 }}
              transition={{ delay: 5.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-gold-gradient glitch-text" data-text="KUNDAI">KUNDAI</span>
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-8xl md:text-[10rem] lg:text-[14rem] font-black leading-[0.85]"
              initial={{ y: 300, rotateX: -80 }}
              animate={{ y: 0, rotateX: 0 }}
              transition={{ delay: 6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-neon-gradient">PIXEL</span>
            </motion.h1>
          </div>

          <motion.div
            className="h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            transition={{ delay: 6.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="overflow-hidden mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 7, duration: 0.01 }}
          >
            <TypeWriter
              text="Where vision meets precision. Crafting extraordinary visual experiences."
              delay={7}
              speed={40}
              className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-light font-mono"
            />
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 8.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="#gallery"
              className="group relative px-12 py-4 font-bold text-sm tracking-[0.2em] uppercase overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-magnetic="VIEW"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] transition-all duration-500 group-hover:from-[#a855f7] group-hover:to-[#ff006e]" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 30px rgba(0,212,255,0.3), 0 0 40px rgba(168,85,247,0.2)" }} />
              <span className="relative z-10 text-black font-mono">VIEW PORTFOLIO</span>
            </motion.a>
            <motion.a
              href="#contact"
              className="group relative px-12 py-4 font-bold text-sm tracking-[0.2em] uppercase border border-[#00d4ff]/30 hover:border-[#a855f7]/60 transition-all duration-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-magnetic="CONTACT"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/0 to-[#a855f7]/0 group-hover:from-[#00d4ff]/10 group-hover:to-[#a855f7]/10 transition-all duration-500" />
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#a855f7] font-mono">GET IN TOUCH</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border border-[#00d4ff]/30 rounded-full flex justify-center">
          <motion.div className="w-1 h-3 bg-[#00d4ff] rounded-full mt-2" animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}

function TypeWriter({ text, delay, speed, className }: { text: string; delay: number; speed: number; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <p className={`${className || ""} ${started && displayed.length < text.length ? "type-cursor" : ""}`}>
      {displayed}
    </p>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} id="about" className="relative py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -100, rotateY: 20 }}
          animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative perspective-3d"
        >
          <motion.div style={{ y: imageY }} className="relative aspect-[3/4] overflow-hidden rounded-sm card-3d holographic-shine">
            <Image src="/images/portrait-1.webp" alt="Kundai creative work" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 to-[#a855f7]/5" />
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
          <motion.div
            className="absolute -bottom-8 -right-8 w-56 h-56 border border-[#00d4ff]/15 rounded-sm -z-10"
            initial={{ opacity: 0, scale: 0.3, rotate: 45 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.4, duration: 1 }}
          />
          <motion.div
            className="absolute -top-8 -left-8 w-40 h-40 border border-[#a855f7]/15 rounded-sm -z-10"
            initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.6, duration: 1 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div className="inline-block mb-6 px-4 py-2 border border-[#a855f7]/20 rounded-full relative overflow-hidden" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7]/5 to-transparent" />
            <span className="relative text-[#a855f7] text-xs tracking-[0.3em] uppercase font-mono">ABOUT_US</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h2 className="text-5xl md:text-7xl font-black leading-none" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              Crafting Visual
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h2 className="text-5xl md:text-7xl font-black leading-none" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <span className="text-neon-gradient">Masterpieces</span>
            </motion.h2>
          </div>

          <motion.div className="h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mb-10" initial={{ width: 0 }} animate={isInView ? { width: 80 } : {}} transition={{ delay: 0.7, duration: 0.8 }} />

          <motion.p className="text-white/40 leading-relaxed mb-6 text-lg font-light" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>
            At Kundai Pixel, we believe every frame tells a story. Our creative studio blends artistry with technology to produce visuals that don&apos;t just capture attention—they hold it.
          </motion.p>
          <motion.p className="text-white/40 leading-relaxed mb-12 text-lg font-light" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9 }}>
            Founded by Kundai Guvaza, pushing creative boundaries and delivering excellence in every pixel.
          </motion.p>

          <div className="grid grid-cols-3 gap-8">
            {[
              { number: "5+", label: "YEARS" },
              { number: "200+", label: "PROJECTS" },
              { number: "100%", label: "SATISFACTION" },
            ].map((stat, i) => (
              <motion.div key={stat.label} className="text-center" initial={{ opacity: 0, y: 40, scale: 0.8 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: 1 + i * 0.15, duration: 0.8 }}>
                <p className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#a855f7]">{stat.number}</p>
                <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase mt-2 font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const galleryItems = [
    { src: "/images/studio-1.webp", title: "Ethereal Vision", category: "PHOTOGRAPHY", accent: "#00d4ff" },
    { src: "/images/portrait-2.webp", title: "Golden Hour", category: "PORTRAIT", accent: "#a855f7" },
    { src: "/images/studio-2.webp", title: "Urban Soul", category: "CREATIVE", accent: "#ff006e" },
    { src: "/images/portrait-3.webp", title: "Midnight Glow", category: "EDITORIAL", accent: "#d4a853" },
  ];

  return (
    <section ref={ref} id="gallery" className="relative py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div className="text-center" initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div className="inline-block mb-6 px-4 py-2 border border-[#00d4ff]/20 rounded-full" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
            <span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">OUR_WORK</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2 className="text-5xl md:text-7xl font-black mb-6" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              Featured <span className="text-neon-gradient">Gallery</span>
            </motion.h2>
          </div>
          <motion.div className="h-px mx-auto bg-gradient-to-r from-[#00d4ff] to-[#a855f7]" initial={{ width: 0 }} animate={isInView ? { width: 80 } : {}} transition={{ delay: 0.4, duration: 0.8 }} />
        </motion.div>
      </div>

      <div ref={scrollContainerRef} className="scroll-gallery flex gap-6 px-6 pb-6">
        {galleryItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="relative flex-shrink-0 w-[70vw] md:w-[45vw] lg:w-[35vw] aspect-[3/4] overflow-hidden rounded-sm group perspective-3d cursor-pointer"
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, rotateY: -5 }}
            data-magnetic="VIEW"
          >
            <Image src={item.src} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" sizes="(max-width: 768px) 70vw, 35vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${item.accent}08, transparent)` }} />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.div className="overflow-hidden">
                <motion.span className="text-xs tracking-[0.3em] uppercase font-mono block" style={{ color: item.accent }} initial={{ y: 40 }} whileInView={{ y: 0 }} transition={{ duration: 0.5 }}>
                  {item.category}
                </motion.span>
              </motion.div>
              <motion.div className="overflow-hidden">
                <motion.h3 className="text-3xl md:text-4xl font-black text-white mt-2" initial={{ y: 60 }} whileInView={{ y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  {item.title}
                </motion.h3>
              </motion.div>
              <motion.div className="h-px mt-4 bg-gradient-to-r from-transparent to-white/0 group-hover:to-white/30 transition-all duration-700" style={{ background: `linear-gradient(to right, ${item.accent}, transparent)` }} initial={{ width: 0 }} whileInView={{ width: 120 }} transition={{ delay: 0.3, duration: 0.8 }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 border border-white/10 group-hover:border-white/30 group-hover:rotate-45 transition-all duration-500 flex items-center justify-center">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 group-hover:text-white transition-colors"><path d="M1 11L11 1M11 1H5M11 1v6" /></svg>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <div className="text-white/20 text-xs font-mono tracking-widest uppercase">SCROLL TO EXPLORE</div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>, title: "Photography", desc: "Capturing emotions and telling stories through every frame with cinematic precision.", accent: "#00d4ff", tag: "01" },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>, title: "Creative Design", desc: "Bespoke design solutions combining aesthetics and functionality.", accent: "#a855f7", tag: "02" },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>, title: "Visual Branding", desc: "Cohesive visual identities that resonate and elevate your presence.", accent: "#ff006e", tag: "03" },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" /></svg>, title: "Content Creation", desc: "Dynamic content that builds lasting connections with your audience.", accent: "#00ff88", tag: "04" },
  ];

  return (
    <section ref={ref} id="services" className="relative py-32 min-h-screen">
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #00d4ff 1px, transparent 0)`, backgroundSize: "50px 50px" }} />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div className="inline-block mb-6 px-4 py-2 border border-[#a855f7]/20 rounded-full" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
            <span className="text-[#a855f7] text-xs tracking-[0.3em] uppercase font-mono">SERVICES</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2 className="text-5xl md:text-7xl font-black mb-6" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              Our <span className="text-neon-gradient">Services</span>
            </motion.h2>
          </div>
          <motion.div className="h-px mx-auto bg-gradient-to-r from-[#00d4ff] to-[#a855f7]" initial={{ width: 0 }} animate={isInView ? { width: 80 } : {}} transition={{ delay: 0.4, duration: 0.8 }} />
        </motion.div>

        <div className="space-y-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="group relative overflow-hidden"
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              data-magnetic={service.title.toUpperCase()}
            >
              <div className="glass rounded-sm p-10 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span className="text-6xl md:text-8xl font-black opacity-[0.06] leading-none font-mono" style={{ color: service.accent }}>{service.tag}</span>
                    <div style={{ color: service.accent }}>{service.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 transition-colors duration-300" style={{ color: `${service.accent}cc` }}>
                      {service.title}
                    </h3>
                    <p className="text-white/30 leading-relaxed font-light text-lg">{service.desc}</p>
                  </div>
                  <motion.div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0" style={{ color: service.accent }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${service.accent}05, transparent 60%)` }} />
              <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 transition-all duration-700" style={{ background: service.accent }} />
              <div className="absolute top-0 left-0 right-0 h-px w-0 group-hover:w-full transition-all duration-700 delay-100" style={{ background: `linear-gradient(to right, ${service.accent}, transparent)` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    { text: "Kundai Pixel transformed our brand identity completely. The attention to detail and creative vision exceeded all expectations.", name: "Sarah Mitchell", role: "Creative Director, Luxe Studio" },
    { text: "Working with Kundai was an incredible experience. The visual storytelling in every project is simply unmatched.", name: "James Koroma", role: "Brand Manager, Apex Co." },
    { text: "The photography and design work delivered by Kundai Pixel speaks volumes. True artistry and professionalism.", name: "Nomsa Dube", role: "Marketing Lead, Horizon Digital" },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section ref={ref} className="relative py-32 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2 }}>
          <motion.div className="inline-block mb-6 px-4 py-2 border border-[#00d4ff]/20 rounded-full"><span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">TESTIMONIALS</span></motion.div>
          <div className="overflow-hidden mb-8">
            <motion.h2 className="text-5xl md:text-7xl font-black" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              Client <span className="text-neon-gradient">Voices</span>
            </motion.h2>
          </div>
        </motion.div>

        <div className="relative h-64 mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.9, rotateX: 10 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00d4ff]/10 to-[#a855f7]/10 flex items-center justify-center mb-8 border border-white/5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#00d4ff]/30">
                  <path d="M11 7.5C11 4.46 8.54 2 5.5 2S0 4.46 0 7.5c0 1.37.5 2.63 1.34 3.6L0 14h6.5C9.54 14 12 11.54 12 8.5c0-.34-.04-.67-.1-1H11zM23 7.5C23 4.46 20.54 2 17.5 2S12 4.46 12 7.5c0 1.37.5 2.63 1.34 3.6L12 14h6.5C21.54 14 24 11.54 24 8.5c0-.34-.04-.67-.1-1H23z" />
                </svg>
              </div>
              <p className="text-white/50 text-xl md:text-2xl leading-relaxed italic mb-8 max-w-2xl font-light">
                &ldquo;{testimonials[active].text}&rdquo;
              </p>
              <p className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#a855f7] font-bold text-lg">{testimonials[active].name}</p>
              <p className="text-white/20 text-sm font-mono mt-1">{testimonials[active].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4 mt-16">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`relative h-1 rounded-full transition-all duration-700 cursor-pointer overflow-hidden ${i === active ? "w-16 bg-[#00d4ff]/20" : "w-8 bg-white/5 hover:bg-white/10"}`} aria-label={`Testimonial ${i + 1}`}>
              {i === active && <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="contact" className="relative py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
        <motion.div initial={{ opacity: 0, x: -100 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div className="inline-block mb-6 px-4 py-2 border border-[#00d4ff]/20 rounded-full"><span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">CONTACT</span></motion.div>

          <div className="overflow-hidden">
            <motion.h2 className="text-5xl md:text-7xl font-black mb-8 leading-none" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              Let&apos;s Create
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h2 className="text-5xl md:text-7xl font-black leading-none" initial={{ y: 120 }} animate={isInView ? { y: 0 } : {}} transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <span className="text-neon-gradient">Together</span>
            </motion.h2>
          </div>

          <motion.div className="h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mb-10" initial={{ width: 0 }} animate={isInView ? { width: 80 } : {}} transition={{ delay: 0.5, duration: 0.8 }} />

          <motion.p className="text-white/40 leading-relaxed mb-12 text-lg font-light" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
            Ready to bring your vision to life? Whether it&apos;s photography, design, or branding, we&apos;re here to make it extraordinary.
          </motion.p>

          <div className="space-y-8">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, text: "hello@kundaipixel.com" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>, text: "+263 7XX XXX XXX" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>, text: "Harare, Zimbabwe" },
            ].map((item, i) => (
              <motion.div key={item.text} className="flex items-center gap-5 group" initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.7 + i * 0.1 }}>
                <div className="w-10 h-10 rounded-full border border-[#00d4ff]/20 flex items-center justify-center group-hover:border-[#a855f7]/40 group-hover:bg-[#a855f7]/5 transition-all duration-500">
                  <span className="text-[#00d4ff] group-hover:text-[#a855f7] transition-colors duration-500">{item.icon}</span>
                </div>
                <span className="text-white/40 group-hover:text-white/70 transition-colors duration-300 font-mono text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mt-12">
            {["IG", "TW", "BE"].map((social, i) => (
              <motion.a key={social} href="#" className="w-12 h-12 border border-[#00d4ff]/15 flex items-center justify-center text-[#00d4ff] text-xs font-mono hover:border-[#a855f7]/40 hover:text-[#a855f7] hover:bg-[#a855f7]/5 transition-all duration-500 rounded-sm" whileHover={{ scale: 1.1, y: -3 }} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 + i * 0.1 }}>
                {social}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 100 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="glass rounded-sm p-10 relative overflow-hidden holographic-shine">
          <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
            {[
              { label: "NAME", type: "text", placeholder: "Your name" },
              { label: "EMAIL", type: "email", placeholder: "your@email.com" },
            ].map((field, i) => (
              <motion.div key={field.label} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }}>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-[#00d4ff]/50 mb-3 font-mono">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} className="w-full bg-transparent border-b border-white/8 focus:border-[#00d4ff] outline-none py-4 text-white placeholder:text-white/15 transition-all duration-500 focus:shadow-[0_1px_0_0_rgba(0,212,255,0.3)]" />
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-[#00d4ff]/50 mb-3 font-mono">MESSAGE</label>
              <textarea rows={4} placeholder="Tell us about your project..." className="w-full bg-transparent border-b border-white/8 focus:border-[#00d4ff] outline-none py-4 text-white placeholder:text-white/15 transition-all duration-500 resize-none focus:shadow-[0_1px_0_0_rgba(0,212,255,0.3)]" />
            </motion.div>
            <motion.button className="relative w-full py-5 font-bold text-sm tracking-[0.2em] uppercase overflow-hidden group cursor-pointer mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] transition-all duration-500 group-hover:from-[#a855f7] group-hover:to-[#ff006e]" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 30px rgba(0,212,255,0.2)" }} />
              <span className="relative z-10 text-black font-mono">SEND MESSAGE</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-2xl font-black tracking-wider">
            <span className="text-gold-gradient">KUNDAI</span>
            <span className="text-white/60 ml-2">PIXEL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]" style={{ boxShadow: "0 0 10px rgba(0,212,255,0.5)" }} />
            <p className="text-white/15 text-xs font-mono tracking-widest">
              SYSTEM_ONLINE &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function useInView(ref: React.RefObject<HTMLElement | null>, options?: { once?: boolean; margin?: string }) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsInView(true); if (options?.once) observer.unobserve(entry.target); }
        else if (!options?.once) { setIsInView(false); }
      },
      { rootMargin: options?.margin || "0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options?.once, options?.margin]);
  return isInView;
}

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {introComplete && (
        <main className="relative">
          <ParticleField />
          <AuroraBackground />
          <MagneticCursor />
          <ScrollProgress />
          <div className="film-grain" />
          <Navbar />
          <HeroSection />
          <SectionDivider />
          <AboutSection />
          <SectionDivider />
          <GallerySection />
          <SectionDivider />
          <ServicesSection />
          <SectionDivider />
          <TestimonialsSection />
          <SectionDivider />
          <ContactSection />
          <Footer />
        </main>
      )}
    </>
  );
}