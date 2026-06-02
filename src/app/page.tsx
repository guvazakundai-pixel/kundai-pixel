"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

const canvasVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

function AnimatedLetters({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      variants={canvasVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterVariants}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
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
    let particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#d4a853", "#00d4ff", "#a855f7", "#f0d48a"];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const handleMouse = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx * 0.00008;
          p.vy += dy * 0.00008;
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.sqrt(
            (particles[j].x - p.x) ** 2 + (particles[j].y - p.y) ** 2
          );
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - d / 120) * 0.15;
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
      style={{ opacity: 0.6 }}
    />
  );
}

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-96 h-96 morphing-blob opacity-10"
        style={{
          background: "radial-gradient(circle, #00d4ff, transparent 70%)",
          top: "10%",
          left: "5%",
          animation: "float-orb 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-80 h-80 morphing-blob opacity-10"
        style={{
          background: "radial-gradient(circle, #a855f7, transparent 70%)",
          bottom: "20%",
          right: "10%",
          animation: "float-orb 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-64 h-64 morphing-blob opacity-8"
        style={{
          background: "radial-gradient(circle, #d4a853, transparent 70%)",
          top: "50%",
          left: "50%",
          animation: "float-orb 14s ease-in-out infinite 2s",
        }}
      />
    </div>
  );
}

function DataStream() {
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    const binary = "01アイウエオカキクケコ";
    const interval = setInterval(() => {
      setChars((prev) => {
        const next = [...prev, binary[Math.floor(Math.random() * binary.length)]];
        return next.length > 30 ? next.slice(-30) : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-4 top-0 bottom-0 pointer-events-none z-10 overflow-hidden opacity-5 font-mono text-xs leading-5">
      {chars.map((c, i) => (
        <div
          key={i}
          className="text-neon-blue"
          style={{
            animation: `data-stream ${Math.random() * 3 + 2}s linear forwards`,
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {c}
        </div>
      ))}
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
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "glass py-3 scanline-sweep"
          : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#home"
          className="text-2xl font-bold tracking-wider"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-gold-gradient">KUNDAI</span>
          <span className="text-white/80 ml-1">PIXEL</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative text-sm tracking-widest text-white/70 hover:text-white transition-colors duration-300 uppercase group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        <button
          className="md:hidden text-gold cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6L18 18M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
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
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest text-white/70 hover:text-gold transition-colors uppercase"
                  onClick={() => setMenuOpen(false)}
                >
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0.9]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/images/hero-wide.webp"
          alt="Kundai Pixel Creative Studio"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <motion.div
          className="absolute inset-0"
          style={{ opacity: overlayOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-transparent to-[#a855f7]/5" />
        </motion.div>
      </motion.div>

      <div className="scanline-sweep absolute inset-0 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="inline-block mb-6 px-4 py-1.5 border border-[#00d4ff]/30 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">
              &lt;CREATIVE_STUDIO /&gt;
            </span>
          </motion.div>

          <div className="overflow-hidden mb-4">
            <motion.h1
              className="text-7xl md:text-9xl lg:text-[12rem] font-bold leading-none"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-gold-gradient glitch-text" data-text="KUNDAI">KUNDAI</span>
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              className="text-7xl md:text-9xl lg:text-[12rem] font-bold leading-none"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-neon-gradient">PIXEL</span>
            </motion.h1>
          </div>

          <motion.div
            className="h-px w-0 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent"
            animate={{ width: 300 }}
            transition={{ delay: 1.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Where vision meets precision. Crafting extraordinary visual
            experiences that captivate and inspire.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="#gallery"
              className="group relative px-10 py-4 text-black font-bold text-sm tracking-widest uppercase overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#a855f7]" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">View Portfolio</span>
            </motion.a>
            <motion.a
              href="#contact"
              className="relative px-10 py-4 border text-sm tracking-widest uppercase overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/0 to-[#a855f7]/0 group-hover:from-[#00d4ff]/20 group-hover:to-[#a855f7]/20 transition-all duration-500" />
              <span className="absolute inset-0 border border-[#00d4ff]/50 group-hover:border-[#a855f7]/50 transition-colors duration-500" />
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#a855f7] group-hover:from-white group-hover:to-white transition-all duration-500 font-semibold">
                Get In Touch
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[#00d4ff]/50 rounded-full flex justify-center relative">
          <motion.div
            className="w-1.5 h-3 bg-[#00d4ff] rounded-full mt-2"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="about"
      className="relative min-h-screen flex items-center py-24"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -100, rotateY: 15 }}
          animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative perspective-3d"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm card-3d holographic-shine">
            <Image
              src="/images/portrait-1.webp"
              alt="Kundai creative work"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 to-[#a855f7]/5" />
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                className="h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ delay: 0.8, duration: 1.5 }}
              />
            </div>
          </div>
          <motion.div
            className="absolute -bottom-6 -right-6 w-48 h-48 border border-[#00d4ff]/20 rounded-sm -z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
          <motion.div
            className="absolute -top-6 -left-6 w-32 h-32 border border-[#a855f7]/20 rounded-sm -z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-block mb-4 px-3 py-1 border border-[#a855f7]/30 rounded-full"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <span className="text-[#a855f7] text-xs tracking-[0.3em] uppercase font-mono">ABOUT_US</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Crafting Visual
              <br />
              <span className="text-neon-gradient">Masterpieces</span>
            </motion.h2>
          </div>

          <motion.div
            className="w-0 h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mb-8"
            animate={isInView ? { width: 64 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          />

          <motion.p
            className="text-white/50 leading-relaxed mb-6 text-lg font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            At Kundai Pixel, we believe every frame tells a story. Our creative
            studio blends artistry with technology to produce visuals that don&apos;t
            just capture attention—they hold it.
          </motion.p>
          <motion.p
            className="text-white/50 leading-relaxed mb-10 text-lg font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Founded by Kundai Guvaza, pushing creative boundaries and delivering
            excellence in every pixel.
          </motion.p>

          <div className="grid grid-cols-3 gap-8">
            {[
              { number: "5+", label: "Years Experience" },
              { number: "200+", label: "Projects Done" },
              { number: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.15 }}
              >
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#a855f7]">
                  {stat.number}
                </p>
                <p className="text-xs text-white/30 tracking-wider uppercase mt-2 font-mono">
                  {stat.label}
                </p>
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

  const galleryItems = [
    { src: "/images/studio-1.webp", title: "Ethereal Vision", category: "Photography", span: "md:col-span-2 md:row-span-2" },
    { src: "/images/portrait-2.webp", title: "Golden Hour", category: "Portrait", span: "" },
    { src: "/images/studio-2.webp", title: "Urban Soul", category: "Creative", span: "" },
    { src: "/images/portrait-3.webp", title: "Midnight Glow", category: "Editorial", span: "md:col-span-2" },
  ];

  return (
    <section ref={ref} id="gallery" className="relative min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-block mb-4 px-3 py-1 border border-[#00d4ff]/30 rounded-full"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            <span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">OUR_WORK</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Featured <span className="text-neon-gradient">Gallery</span>
          </h2>
          <motion.div
            className="h-px w-0 mx-auto bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
            animate={isInView ? { width: 64 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-[300px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              className={`relative group overflow-hidden rounded-sm cursor-pointer ${item.span} perspective-3d`}
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, rotateY: -3, rotateX: 2 }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/0 to-[#a855f7]/0 group-hover:from-[#00d4ff]/5 group-hover:to-[#a855f7]/5 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <motion.span
                  className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  {item.category}
                </motion.span>
                <h3 className="text-white text-2xl font-semibold">{item.title}</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
      title: "Photography",
      desc: "Professional photography that captures emotions and tells compelling stories through every frame.",
      accent: "#00d4ff",
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
      title: "Creative Design",
      desc: "Bespoke design solutions combining aesthetics and functionality for unforgettable brand experiences.",
      accent: "#a855f7",
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
      title: "Visual Branding",
      desc: "Crafting cohesive visual identities that resonate with your audience and elevate your brand presence.",
      accent: "#d4a853",
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" /></svg>,
      title: "Content Creation",
      desc: "Dynamic content that engages, inspires, and builds lasting connections with your target audience.",
      accent: "#00d4ff",
    },
  ];

  return (
    <section ref={ref} id="services" className="relative min-h-screen py-24">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #00d4ff 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-block mb-4 px-3 py-1 border border-[#a855f7]/30 rounded-full"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            <span className="text-[#a855f7] text-xs tracking-[0.3em] uppercase font-mono">SERVICES</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Our <span className="text-neon-gradient">Services</span>
          </h2>
          <motion.div
            className="h-px w-0 mx-auto bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
            animate={isInView ? { width: 64 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 perspective-3d">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="glass rounded-sm p-8 group card-3d holographic-shine relative overflow-hidden"
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-700"
                style={{ background: service.accent }}
              />
              <div
                className="absolute top-0 right-0 h-1 w-0 group-hover:w-full transition-all duration-700 delay-100"
                style={{ background: service.accent }}
              />
              <div
                className="mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ color: service.accent }}
              >
                {service.icon}
              </div>
              <h3
                className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:opacity-100"
                style={{ color: `${service.accent}cc` }}
              >
                {service.title}
              </h3>
              <p className="text-white/40 leading-relaxed font-light">
                {service.desc}
              </p>
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
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00d4ff]/[0.01] to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div className="inline-block mb-4 px-3 py-1 border border-[#00d4ff]/30 rounded-full">
            <span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">TESTIMONIALS</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Client <span className="text-neon-gradient">Voices</span>
          </h2>
          <motion.div
            className="h-px w-0 mx-auto bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mb-16"
            animate={isInView ? { width: 64 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        <div className="relative h-56">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-[#00d4ff]/20 mb-6">
                <path d="M11 7.5C11 4.46 8.54 2 5.5 2S0 4.46 0 7.5c0 1.37.5 2.63 1.34 3.6L0 14h6.5C9.54 14 12 11.54 12 8.5c0-.34-.04-.67-.1-1H11zM23 7.5C23 4.46 20.54 2 17.5 2S12 4.46 12 7.5c0 1.37.5 2.63 1.34 3.6L12 14h6.5C21.54 14 24 11.54 24 8.5c0-.34-.04-.67-.1-1H23z" />
              </svg>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed italic mb-6 max-w-2xl font-light">
                &ldquo;{testimonials[active].text}&rdquo;
              </p>
              <p className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#a855f7] font-semibold text-lg">
                {testimonials[active].name}
              </p>
              <p className="text-white/30 text-sm font-mono mt-1">{testimonials[active].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-12 h-1 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                i === active ? "bg-[#00d4ff]/30" : "bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            >
              {i === active && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              )}
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
    <section ref={ref} id="contact" className="relative min-h-screen flex items-center py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div className="inline-block mb-4 px-3 py-1 border border-[#00d4ff]/30 rounded-full">
            <span className="text-[#00d4ff] text-xs tracking-[0.3em] uppercase font-mono">CONTACT</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s Create
              <br />
              <span className="text-neon-gradient">Together</span>
            </motion.h2>
          </div>

          <motion.div
            className="w-0 h-px bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mb-8"
            animate={isInView ? { width: 64 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          />

          <motion.p
            className="text-white/50 leading-relaxed mb-10 text-lg font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            Ready to bring your vision to life? Whether it&apos;s photography,
            design, or branding, we&apos;re here to make it extraordinary.
          </motion.p>

          <div className="space-y-6">
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, text: "hello@kundaipixel.com" },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>, text: "+263 7XX XXX XXX" },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>, text: "Harare, Zimbabwe" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-4 text-white/50 group"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <span className="text-[#00d4ff] group-hover:text-[#a855f7] transition-colors duration-300">{item.icon}</span>
                <span className="group-hover:text-white/70 transition-colors duration-300">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mt-10">
            {["Instagram", "Twitter", "Behance"].map((social, i) => (
              <motion.a
                key={social}
                href="#"
                className="px-5 py-2.5 border border-[#00d4ff]/20 text-[#00d4ff] text-xs tracking-widest uppercase hover:border-[#a855f7]/50 hover:text-[#a855f7] transition-all duration-300 rounded-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-sm p-8 relative overflow-hidden holographic-shine"
        >
          <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
            {[
              { label: "Name", type: "text", placeholder: "Your name" },
              { label: "Email", type: "email", placeholder: "your@email.com" },
            ].map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <label className="block text-xs tracking-widest uppercase text-[#00d4ff]/60 mb-2 font-mono">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border-b border-white/10 focus:border-[#00d4ff] outline-none py-3 text-white placeholder:text-white/20 transition-all duration-300 focus:shadow-[0_1px_0_0_#00d4ff]"
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-xs tracking-widest uppercase text-[#00d4ff]/60 mb-2 font-mono">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your project..."
                className="w-full bg-transparent border-b border-white/10 focus:border-[#00d4ff] outline-none py-3 text-white placeholder:text-white/20 transition-all duration-300 resize-none focus:shadow-[0_1px_0_0_#00d4ff]"
              />
            </motion.div>
            <motion.button
              className="relative w-full py-4 font-bold text-sm tracking-widest uppercase overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#a855f7]" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-black">Send Message</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-bold tracking-wider">
            <span className="text-gold-gradient">KUNDAI</span>
            <span className="text-white/80 ml-1">PIXEL</span>
          </div>
          <p className="text-white/20 text-sm font-mono">
            &copy; {new Date().getFullYear()} KUNDAI_PIXEL. All rights reserved.
          </p>
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
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options?.once) observer.unobserve(entry.target);
        } else if (!options?.once) {
          setIsInView(false);
        }
      },
      { rootMargin: options?.margin || "0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options?.once, options?.margin]);

  return isInView;
}

export default function Home() {
  return (
    <main className="relative">
      <ParticleField />
      <FloatingOrbs />
      <div className="scanline-overlay" />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}