"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "py-6"
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
              className="text-sm tracking-widest text-white/70 hover:text-gold transition-colors duration-300 uppercase"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              {link.label}
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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/images/hero-wide.webp"
          alt="Kundai Pixel Creative Studio"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.p
            className="text-gold/80 text-sm md:text-base tracking-[0.4em] uppercase mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Creative Studio
          </motion.p>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="text-gold-gradient">KUNDAI</span>
            <br />
            <span className="text-white">PIXEL</span>
          </motion.h1>

          <motion.div
            className="w-24 h-0.5 bg-gold mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 1, duration: 0.8 }}
          />

          <motion.p
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Where vision meets precision. Crafting extraordinary visual
            experiences that captivate and inspire.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.a
              href="#gallery"
              className="px-8 py-3.5 bg-gold text-black font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-gold-light transition-colors duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View Portfolio
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3.5 border border-gold/50 text-gold text-sm tracking-widest uppercase rounded-sm hover:bg-gold/10 transition-colors duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-gold rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
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
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image
              src="/images/portrait-1.webp"
              alt="Kundai creative work"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <motion.div
            className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-gold/30 rounded-sm -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <motion.div
            className="absolute -top-6 -left-6 w-32 h-32 bg-gold/5 rounded-sm -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            About Us
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Crafting Visual
            <br />
            <span className="text-gold-gradient">Masterpieces</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mb-8" />
          <p className="text-white/60 leading-relaxed mb-6">
            At Kundai Pixel, we believe every frame tells a story. Our creative
            studio blends artistry with technology to produce visuals that don&apos;t
            just capture attention—they hold it. From striking photography to
            immersive design, we bring your vision to life with precision and
            passion.
          </p>
          <p className="text-white/60 leading-relaxed mb-10">
            Founded by Kundai Guvaza, our studio is dedicated to pushing creative
            boundaries and delivering excellence in every pixel.
          </p>

          <div className="grid grid-cols-3 gap-8">
            {[
              { number: "5+", label: "Years Experience" },
              { number: "200+", label: "Projects Done" },
              { number: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-gold">{stat.number}</p>
                <p className="text-xs text-white/50 tracking-wider uppercase mt-1">
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
    {
      src: "/images/studio-1.webp",
      title: "Ethereal Vision",
      category: "Photography",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      src: "/images/portrait-2.webp",
      title: "Golden Hour",
      category: "Portrait",
      span: "",
    },
    {
      src: "/images/studio-2.webp",
      title: "Urban Soul",
      category: "Creative",
      span: "",
    },
    {
      src: "/images/portrait-3.webp",
      title: "Midnight Glow",
      category: "Editorial",
      span: "md:col-span-2",
    },
  ];

  return (
    <section
      ref={ref}
      id="gallery"
      className="relative min-h-screen py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gold-gradient">Gallery</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-[300px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              className={`relative group overflow-hidden rounded-sm cursor-pointer ${item.span}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">
                  {item.category}
                </p>
                <h3 className="text-white text-2xl font-semibold">
                  {item.title}
                </h3>
              </div>
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
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
      title: "Photography",
      desc: "Professional photography that captures emotions and tells compelling stories through every frame.",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Creative Design",
      desc: "Bespoke design solutions combining aesthetics and functionality for unforgettable brand experiences.",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
      title: "Visual Branding",
      desc: "Crafting cohesive visual identities that resonate with your audience and elevate your brand presence.",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
        </svg>
      ),
      title: "Content Creation",
      desc: "Dynamic content that engages, inspires, and builds lasting connections with your target audience.",
    },
  ];

  return (
    <section
      ref={ref}
      id="services"
      className="relative min-h-screen py-24"
    >
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #d4a853 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gold-gradient">Services</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="glass rounded-sm p-8 group hover:border-gold/40 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-gold mb-5 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gold transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
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
    {
      text: "Kundai Pixel transformed our brand identity completely. The attention to detail and creative vision exceeded all expectations.",
      name: "Sarah Mitchell",
      role: "Creative Director, Luxe Studio",
    },
    {
      text: "Working with Kundai was an incredible experience. The visual storytelling in every project is simply unmatched.",
      name: "James Koroma",
      role: "Brand Manager, Apex Co.",
    },
    {
      text: "The photography and design work delivered by Kundai Pixel speaks volumes. True artistry and professionalism.",
      name: "Nomsa Dube",
      role: "Marketing Lead, Horizon Digital",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="text-gold-gradient">Voices</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-16" />
        </motion.div>

        <div className="relative h-48">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-gold/20 mb-6">
                <path d="M11 7.5C11 4.46 8.54 2 5.5 2S0 4.46 0 7.5c0 1.37.5 2.63 1.34 3.6L0 14h6.5C9.54 14 12 11.54 12 8.5c0-.34-.04-.67-.1-1H11zM23 7.5C23 4.46 20.54 2 17.5 2S12 4.46 12 7.5c0 1.37.5 2.63 1.34 3.6L12 14h6.5C21.54 14 24 11.54 24 8.5c0-.34-.04-.67-.1-1H23z" />
              </svg>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed italic mb-6 max-w-2xl">
                &ldquo;{testimonials[active].text}&rdquo;
              </p>
              <p className="text-gold font-semibold">{testimonials[active].name}</p>
              <p className="text-white/40 text-sm">{testimonials[active].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === active ? "bg-gold scale-125" : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
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
    <section
      ref={ref}
      id="contact"
      className="relative min-h-screen flex items-center py-24"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Let&apos;s Create
            <br />
            <span className="text-gold-gradient">Together</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mb-8" />
          <p className="text-white/60 leading-relaxed mb-10">
            Ready to bring your vision to life? Whether it&apos;s photography,
            design, or branding, we&apos;re here to make it extraordinary.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                text: "hello@kundaipixel.com",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                ),
                text: "+263 7XX XXX XXX",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                text: "Harare, Zimbabwe",
              },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-4 text-white/60"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="text-gold">{item.icon}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mt-10">
            {["Instagram", "Twitter", "Behance"].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="px-5 py-2.5 border border-gold/30 text-gold text-xs tracking-widest uppercase hover:bg-gold/10 transition-colors duration-300 rounded-sm"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-sm p-8"
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {[
              { label: "Name", type: "text", placeholder: "Your name" },
              { label: "Email", type: "email", placeholder: "your@email.com" },
            ].map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <label className="block text-xs tracking-widest uppercase text-gold/70 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border-b border-gold/20 focus:border-gold outline-none py-3 text-white placeholder:text-white/30 transition-colors duration-300"
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-xs tracking-widest uppercase text-gold/70 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your project..."
                className="w-full bg-transparent border-b border-gold/20 focus:border-gold outline-none py-3 text-white placeholder:text-white/30 transition-colors duration-300 resize-none"
              />
            </motion.div>
            <motion.button
              className="w-full py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-gold-light transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-bold tracking-wider">
            <span className="text-gold-gradient">KUNDAI</span>
            <span className="text-white/80 ml-1">PIXEL</span>
          </div>
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Kundai Pixel. All rights reserved.
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