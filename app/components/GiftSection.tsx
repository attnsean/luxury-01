"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GiftSection() {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <section className="relative w-full py-16 px-6 bg-[#FAF8F5] text-center flex flex-col items-center gap-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-2 max-w-[340px]"
      >
        <p className="font-creattion text-4xl text-[#8E7D6B]">
          Wedding Gift
        </p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-1" />
        <p className="text-xs text-[#5E5E5E] leading-relaxed font-light">
          Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui tautan di bawah ini.
        </p>
      </motion.div>

      {/* Bank Cards */}
      <div className="w-full max-w-[340px] flex flex-col gap-5">
        {/* BCA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 rounded-2xl p-5 shadow-sm border border-[#E8E2DA] flex flex-col items-center gap-3"
        >
          <div className="h-7 w-20 relative">
            <Image
              src="/images/bca.png"
              alt="BCA"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-[11px] text-[#7A7A7A] uppercase font-light">No. Rekening</p>
            <p className="font-editors text-xl text-[#2B2B2B] tracking-wider my-0.5">1574988988</p>
            <p className="text-xs text-[#5E5E5E] font-medium">a/n Marvel</p>
          </div>
          <button
            onClick={() => copyToClipboard("1574988988", "BCA")}
            className="mt-1 px-5 py-2 rounded-full bg-[#FAF8F5] border border-[#C2A676] text-[#2B2B2B] text-xs font-medium hover:bg-[#C2A676] hover:text-white transition-all cursor-pointer"
          >
            {copiedBank === "BCA" ? "✓ Tersalin!" : "Salin No. Rekening"}
          </button>
        </motion.div>

        {/* BRI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/95 rounded-2xl p-5 shadow-sm border border-[#E8E2DA] flex flex-col items-center gap-3"
        >
          <div className="h-7 w-20 relative">
            <Image
              src="/images/bri.png"
              alt="BRI"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-[11px] text-[#7A7A7A] uppercase font-light">No. Rekening</p>
            <p className="font-editors text-xl text-[#2B2B2B] tracking-wider my-0.5">321321321</p>
            <p className="text-xs text-[#5E5E5E] font-medium">a/n Nathalie</p>
          </div>
          <button
            onClick={() => copyToClipboard("321321321", "BRI")}
            className="mt-1 px-5 py-2 rounded-full bg-[#FAF8F5] border border-[#C2A676] text-[#2B2B2B] text-xs font-medium hover:bg-[#C2A676] hover:text-white transition-all cursor-pointer"
          >
            {copiedBank === "BRI" ? "✓ Tersalin!" : "Salin No. Rekening"}
          </button>
        </motion.div>

        {/* Physical Gift Address */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/95 rounded-2xl p-5 shadow-sm border border-[#E8E2DA] flex flex-col items-center gap-2"
        >
          <span className="font-analogue italic text-base text-[#8E7D6B]">Kirim Kado Fisik</span>
          <p className="text-xs font-medium text-[#2B2B2B]">Marvel / Nathalie (+6285150000715)</p>
          <p className="text-xs text-[#5E5E5E] font-light leading-relaxed">
            Jl. Rancabentang No. 18, Ciumbuleuit, Kec. Cidadap, Kota Bandung 40142
          </p>
          <button
            onClick={() => copyToClipboard("Jl. Rancabentang No. 18, Ciumbuleuit, Kec. Cidadap, Kota Bandung 40142", "Alamat")}
            className="mt-2 px-5 py-2 rounded-full bg-[#FAF8F5] border border-[#C2A676] text-[#2B2B2B] text-xs font-medium hover:bg-[#C2A676] hover:text-white transition-all cursor-pointer"
          >
            {copiedBank === "Alamat" ? "✓ Tersalin!" : "Salin Alamat"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
