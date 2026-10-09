"use client";
import React from "react";
import { motion } from "framer-motion";

export default function DresscodeSection() {
  const colors = [
    { name: "Cream", hex: "#F5EBE0" },
    { name: "Beige", hex: "#D5BDAF" },
    { name: "Warm Taupe", hex: "#B07D62" },
    { name: "Terracotta", hex: "#8E7D6B" },
    { name: "White", hex: "#FFFFFF" },
  ];

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
          Dresscode
        </p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-2" />
        <p className="text-xs text-[#5E5E5E] leading-relaxed font-light mt-1">
          Kami dengan hormat menganjurkan para tamu undangan untuk mengenakan warna-warna ini di hari istimewa kami.
        </p>

        {/* Color Palette Swatches */}
        <div className="flex items-center justify-center gap-3 mt-5">
          {colors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                style={{ backgroundColor: c.hex }}
                className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
              />
              <span className="text-[9px] text-[#7A7A7A] font-light">{c.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
