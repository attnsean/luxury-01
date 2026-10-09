"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LoveStorySection() {
  const stories = [
    {
      year: "2021",
      title: "Pertama Bertemu",
      desc: "Pertemuan pertama yang tak terduga, mengenalkan kami pada rasa saling nyaman dan tujuan yang sama.",
    },
    {
      year: "2023",
      title: "Menjalin Hubungan",
      desc: "Memutuskan untuk saling berkomitmen, saling mendukung mimpi satu sama lain dalam suka maupun duka.",
    },
    {
      year: "2026",
      title: "Lamaran",
      desc: "Dengan restu kedua orang tua, kami mengikat janji untuk melangkah ke jenjang yang lebih serius.",
    },
    {
      year: "2027",
      title: "Menuju Pelaminan",
      desc: "Hari yang kami nanti akhirnya tiba, menyempurnakan ibadah bersama dalam ikatan suci pernikahan.",
    },
  ];

  return (
    <section className="relative w-full py-16 px-6 bg-[#FAF8F5] text-center flex flex-col items-center gap-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-1"
      >
        <p className="font-analogue italic text-[#8E7D6B] text-lg tracking-[0.2em] uppercase">
          Love
        </p>
        <h2 className="font-creattion text-5xl text-[#2B2B2B]">
          Story
        </h2>
      </motion.div>

      {/* Timeline items */}
      <div className="relative w-full max-w-[340px] flex flex-col gap-6">
        {stories.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="flex flex-col items-center bg-white/90 rounded-2xl p-5 shadow-sm border border-[#E8E2DA] text-center"
          >
            <span className="font-editors text-lg text-[#C2A676] tracking-widest">
              {s.year}
            </span>
            <h3 className="font-analogue italic text-base text-[#2B2B2B] mt-1">
              {s.title}
            </h3>
            <p className="text-xs text-[#5E5E5E] font-light leading-relaxed mt-2">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
