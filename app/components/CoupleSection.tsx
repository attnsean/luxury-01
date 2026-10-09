"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CoupleSectionProps {
  bride?: {
    name: string;
    fullName: string;
    father: string;
    mother: string;
    order: string;
    photoUrl?: string;
    instagram?: string;
  };
  groom?: {
    name: string;
    fullName: string;
    father: string;
    mother: string;
    order: string;
    photoUrl?: string;
    instagram?: string;
  };
}

export default function CoupleSection({
  bride = {
    name: "Nathalie",
    fullName: "Nathalie Aurelia, S.E., M.B.A.",
    order: "Nathalie Pertama dari",
    father: "Bapak Abdul Rozak",
    mother: "Ibu Adelia Marni",
    photoUrl: "/images/bride-photo.jpg",
    instagram: "putricantika",
  },
  groom = {
    name: "Marvel",
    fullName: "Marvel Nathaniel, S.T., M.M.",
    order: "Putra Pertama dari",
    father: "Bapak Deni Bastian",
    mother: "Ibu Aisha Dania",
    photoUrl: "/images/groom-photo.jpg",
    instagram: "andikapratama",
  },
}: CoupleSectionProps) {
  return (
    <section className="relative w-full py-16 px-6 bg-[#FAF8F5] text-center flex flex-col items-center gap-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-2 max-w-[360px]"
      >
        <p className="font-analogue italic text-[#8E7D6B] text-lg tracking-[0.2em] uppercase">
          Kedua Mempelai
        </p>
        <h2 className="font-editors text-3xl text-[#2B2B2B] tracking-wider uppercase">
          Mempelai
        </h2>
        <p className="text-xs text-[#5E5E5E] leading-relaxed mt-2 font-light">
          Assalamu’alaikum Warahmatullahi Wabarakatuh.
          <br />
          Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.
        </p>
      </motion.div>

      {/* Bride Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-[340px] flex flex-col items-center bg-white/90 rounded-3xl p-6 shadow-md border border-[#E8E2DA]"
      >
        <div className="relative w-48 h-64 rounded-t-full rounded-b-2xl overflow-hidden shadow-inner mb-5 border-2 border-[#C2A676]/30">
          <Image
            src={bride.photoUrl || "/images/bride-photo.jpg"}
            alt={bride.fullName}
            fill
            className="object-cover object-top hover:scale-105 transition-transform duration-700"
          />
        </div>

        <h3 className="font-creattion text-4xl text-[#2B2B2B] font-normal">
          {bride.name}
        </h3>
        <p className="font-editors text-sm tracking-widest text-[#2B2B2B] uppercase mt-1">
          {bride.fullName}
        </p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-3" />
        <p className="text-xs text-[#7A7A7A] font-light">
          {bride.order}
        </p>
        <p className="text-xs text-[#2B2B2B] font-medium mt-0.5">
          {bride.father} dan {bride.mother}
        </p>

        {bride.instagram && (
          <a
            href={`https://instagram.com/${bride.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] text-[11px] text-[#5E5E5E] hover:text-[#2B2B2B] hover:border-[#C2A676] transition-colors"
          >
            <span>@{bride.instagram}</span>
          </a>
        )}
      </motion.div>

      {/* Decorative & Separator */}
      <span className="font-creattion text-4xl text-[#C2A676]">&</span>

      {/* Groom Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-[340px] flex flex-col items-center bg-white/90 rounded-3xl p-6 shadow-md border border-[#E8E2DA]"
      >
        <div className="relative w-48 h-64 rounded-t-full rounded-b-2xl overflow-hidden shadow-inner mb-5 border-2 border-[#C2A676]/30">
          <Image
            src={groom.photoUrl || "/images/groom-photo.jpg"}
            alt={groom.fullName}
            fill
            className="object-cover object-top hover:scale-105 transition-transform duration-700"
          />
        </div>

        <h3 className="font-creattion text-4xl text-[#2B2B2B] font-normal">
          {groom.name}
        </h3>
        <p className="font-editors text-sm tracking-widest text-[#2B2B2B] uppercase mt-1">
          {groom.fullName}
        </p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-3" />
        <p className="text-xs text-[#7A7A7A] font-light">
          {groom.order}
        </p>
        <p className="text-xs text-[#2B2B2B] font-medium mt-0.5">
          {groom.father} dan {groom.mother}
        </p>

        {groom.instagram && (
          <a
            href={`https://instagram.com/${groom.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] text-[11px] text-[#5E5E5E] hover:text-[#2B2B2B] hover:border-[#C2A676] transition-colors"
          >
            <span>@{groom.instagram}</span>
          </a>
        )}
      </motion.div>
    </section>
  );
}
