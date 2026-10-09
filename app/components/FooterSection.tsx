"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FooterSectionProps {
  brideName?: string;
  groomName?: string;
}

export default function FooterSection({
  brideName = "Putri",
  groomName = "Andika",
}: FooterSectionProps) {
  return (
    <footer className="relative w-full py-16 px-6 bg-[#FAF8F5] text-center flex flex-col items-center gap-8 overflow-hidden">
      {/* Photo frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative w-48 h-64 rounded-t-full rounded-b-2xl overflow-hidden shadow-md border-2 border-[#C2A676]/30 mb-2"
      >
        <Image
          src="/images/closing-photo.jpg"
          alt="Closing Couple"
          fill
          className="object-cover object-top"
        />
      </motion.div>

      {/* Closing text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-[340px] flex flex-col items-center gap-2"
      >
        <h3 className="font-creattion text-4xl text-[#2B2B2B]">
          Terima Kasih
        </h3>
        <p className="text-xs text-[#5E5E5E] leading-relaxed font-light mt-1">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do’a restu kepada kami.
          <br />
          <br />
          Wassalamu’alaikum warahmatullahi wabarakatuh.
        </p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-2" />
        <p className="text-[11px] text-[#7A7A7A] uppercase tracking-wider font-light">
          Kami Yang Berbahagia
        </p>
        <p className="font-creattion text-3xl text-[#2B2B2B] mt-0.5">
          {brideName} & {groomName}
        </p>
      </motion.div>

      {/* Sera Story Watermark */}
      <div className="pt-6 border-t border-[#E8E2DA]/60 w-full flex flex-col items-center gap-1">
        <p className="text-[10px] text-[#A3A3A3] font-light">
          Made with ♥ by{" "}
          <a
            href="https://serastory.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#8E7D6B] hover:text-[#2B2B2B] transition-colors"
          >
            serastory.com
          </a>
        </p>
      </div>
    </footer>
  );
}
