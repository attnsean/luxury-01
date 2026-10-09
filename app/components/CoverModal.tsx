"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CoverModalProps {
  guestName: string;
  brideName?: string;
  groomName?: string;
  onOpen: () => void;
}

export default function CoverModal({
  guestName,
  brideName = "Putri",
  groomName = "Andika",
  onOpen,
}: CoverModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%", transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1a19]"
        >
          {/* Mobile frame container matching max-width 450px */}
          <div className="relative w-full max-w-[450px] h-full flex flex-col justify-between items-center text-center p-8 bg-[#FAF8F5] overflow-hidden shadow-2xl">
            {/* Background photo with subtle luxury dark overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/cover-bg.jpg"
                alt="Cover Background"
                fill
                priority
                className="object-cover object-center filter brightness-[0.85] contrast-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/90 via-[#1A1918]/50 to-[#1A1918]/80" />
            </div>

            {/* Tree shadow overlay on cover */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.18] animate-tree-sway z-[1]">
              <Image
                src="/images/tree-shadow.png"
                alt="Shadow"
                fill
                className="object-cover"
              />
            </div>

            {/* Top section: Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 pt-12 flex flex-col items-center"
            >
              <p className="font-analogue italic text-white/90 text-lg tracking-[0.25em] uppercase mb-2">
                The Wedding Of
              </p>
              <h1 className="font-creattion text-5xl md:text-6xl text-white font-normal drop-shadow-md">
                {brideName} & {groomName}
              </h1>
            </motion.div>

            {/* Bottom section: Guest Invitation Card & Open Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative z-10 w-full pb-8 flex flex-col items-center gap-6"
            >
              {/* Glass guest badge */}
              <div className="w-full max-w-[340px] px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col items-center text-white">
                <p className="text-xs uppercase tracking-widest text-white/80 font-light mb-1.5 font-poppins">
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <h2 className="font-editors text-2xl font-light text-white my-1 tracking-wider uppercase">
                  {guestName}
                </h2>
                <p className="text-[10px] text-white/60 italic font-light mt-1">
                  *Mohon maaf jika ada kesalahan dalam penulisan nama / gelar.
                </p>
              </div>

              {/* Buka Undangan Button */}
              <button
                onClick={handleOpen}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C2A676] to-[#A3895B] text-white text-sm font-medium tracking-wider uppercase shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                {/* Envelope open icon */}
                <svg
                  className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L2 9.5V20H22V9.5L12 3ZM12 5.5L19 10.1L12 14.7L5 10.1L12 5.5ZM4 11.4L10.7 15.8L4 20.3V11.4ZM20 20.3L13.3 15.8L20 11.4V20.3ZM12 16.7L18.4 21H5.6L12 16.7Z" />
                </svg>
                <span>Buka Undangan</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
