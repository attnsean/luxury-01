"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LiveStreamingSection() {
  return (
    <section className="relative w-full py-12 px-6 bg-[#FAF8F5] text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-[340px] flex flex-col items-center bg-white/90 rounded-3xl p-6 shadow-md border border-[#E8E2DA]"
      >
        <p className="font-analogue italic text-lg text-[#8E7D6B] uppercase tracking-wider">
          Live Streaming
        </p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-2" />
        <p className="text-xs text-[#5E5E5E] leading-relaxed font-light mt-1">
          Temui kami secara virtual untuk menyaksikan acara pernikahan kami yang insyaaAllah akan disiarkan langsung melalui tautan di bawah ini.
        </p>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2B2B2B] text-white text-xs font-medium hover:bg-[#C2A676] transition-colors"
        >
          <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>Tonton Live Streaming</span>
        </a>
      </motion.div>
    </section>
  );
}
