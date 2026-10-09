"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroSectionProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
}

export default function HeroSection({
  brideName = "Putri",
  groomName = "Andika",
  weddingDate = "28 . 12 . 2027",
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between items-center text-center p-8 bg-[#FAF8F5] overflow-hidden">
      {/* Background Photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-couple.jpg"
          alt="Hero Couple"
          fill
          priority
          className="object-cover object-center filter brightness-[0.82]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1A19]/80 via-transparent to-[#FAF8F5]" />
      </div>

      {/* Top Details */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 pt-10 flex flex-col items-center"
      >
        <p className="font-analogue italic text-white/90 text-sm tracking-[0.25em] uppercase mb-1">
          The Wedding Of
        </p>
        <h1 className="font-creattion text-5xl md:text-6xl text-white font-normal drop-shadow-md">
          {brideName} & {groomName}
        </h1>
        <p className="font-editors text-white/90 text-sm tracking-[0.3em] uppercase mt-2">
          {weddingDate}
        </p>
      </motion.div>

      {/* Center Monogram Initials */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative z-10 my-auto flex items-center justify-center"
      >
        <div className="w-24 h-24 rounded-full border border-white/30 backdrop-blur-sm bg-white/10 flex items-center justify-center shadow-lg">
          <div className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center">
            <span className="font-analogue text-white text-3xl italic tracking-widest">
              {brideName.charAt(0)}
              <span className="text-[#C2A676] text-xl not-italic mx-0.5">&</span>
              {groomName.charAt(0)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative z-10 pb-4 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] uppercase tracking-widest text-[#5E5E5E] font-medium">
          Scroll Down
        </span>
        <div className="w-5 h-8 rounded-full border border-[#8E7D6B]/50 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#8E7D6B]"
          />
        </div>
      </motion.div>
    </section>
  );
}
