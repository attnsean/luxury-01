"use client";
import React from "react";
import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="relative w-full py-16 px-8 bg-[#FAF8F5] text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-[360px] flex flex-col items-center gap-5"
      >
        {/* Subtle decorative motif */}
        <div className="w-12 h-0.5 bg-[#C2A676]" />

        <p className="font-poppins text-xs leading-[2em] text-[#5E5E5E] italic font-light px-2">
          &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
        </p>

        <p className="font-analogue italic text-sm tracking-widest text-[#2B2B2B] font-medium">
          Q.S Ar-Rum : 21
        </p>

        <div className="w-12 h-0.5 bg-[#C2A676]" />
      </motion.div>
    </section>
  );
}
