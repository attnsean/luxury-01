"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface EventSectionProps {
  weddingDate?: string;
  targetDate?: string; // ISO date string e.g. "2027-12-28T08:00:00"
}

export default function EventSection({
  targetDate = "2027-12-28T08:00:00",
}: EventSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const mapsUrl = "https://maps.google.com/?q=Menara+165+Jakarta+Selatan";

  const saveToCalendar = (title: string, start: string, end: string) => {
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent("Pernikahan Putri & Andika")}&location=${encodeURIComponent("Menara 165 Jakarta Selatan")}`;
    window.open(gCalUrl, "_blank");
  };

  return (
    <section className="relative w-full py-16 px-6 bg-[#FAF8F5] text-center flex flex-col items-center gap-10">
      {/* Background graphic */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image
          src="/images/event-bg.jpg"
          alt="Event Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center gap-2"
      >
        <p className="font-analogue italic text-[#8E7D6B] text-lg tracking-[0.2em] uppercase">
          Save The Date
        </p>
        <h2 className="font-editors text-3xl text-[#2B2B2B] tracking-wider uppercase">
          Wedding Event
        </h2>
      </motion.div>

      {/* Countdown Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-[340px] grid grid-cols-4 gap-2.5 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-[#E8E2DA]"
      >
        {[
          { label: "Hari", value: timeLeft.days },
          { label: "Jam", value: timeLeft.hours },
          { label: "Menit", value: timeLeft.minutes },
          { label: "Detik", value: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA]/60"
          >
            <span className="font-editors text-2xl text-[#2B2B2B] font-light">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-[#7A7A7A] uppercase tracking-wider font-light mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Akad Nikah Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-[340px] flex flex-col items-center bg-white/95 rounded-3xl p-6 shadow-md border border-[#E8E2DA]"
      >
        <p className="font-analogue italic text-xl text-[#8E7D6B]">Akad Nikah</p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-2" />

        <div className="flex items-center gap-3 my-2">
          <span className="text-xs uppercase tracking-wider text-[#7A7A7A]">Minggu</span>
          <span className="font-editors text-4xl text-[#2B2B2B]">28</span>
          <span className="text-xs uppercase tracking-wider text-[#7A7A7A]">Desember 2027</span>
        </div>

        <p className="font-poppins text-xs font-medium text-[#2B2B2B] mt-1">
          08.00 - 10.00 WIB
        </p>

        <div className="mt-4 text-xs text-[#5E5E5E] font-light">
          <p className="font-medium text-[#2B2B2B]">Menara 165</p>
          <p>Jl. TB Simatupang, Cilandak Timur, Jakarta Selatan</p>
        </div>

        <div className="mt-5 flex items-center gap-2.5 w-full">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-full bg-[#FAF8F5] border border-[#C2A676] text-[#2B2B2B] text-xs font-medium hover:bg-[#C2A676] hover:text-white transition-all text-center"
          >
            Google Maps
          </a>
          <button
            onClick={() => saveToCalendar("Akad Nikah Putri & Andika", "20271228T010000Z", "20271228T030000Z")}
            className="flex-1 py-2 px-3 rounded-full bg-[#2B2B2B] text-white text-xs font-medium hover:bg-[#444] transition-all text-center cursor-pointer"
          >
            Simpan Kalender
          </button>
        </div>
      </motion.div>

      {/* Resepsi Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-[340px] flex flex-col items-center bg-white/95 rounded-3xl p-6 shadow-md border border-[#E8E2DA]"
      >
        <p className="font-analogue italic text-xl text-[#8E7D6B]">Resepsi</p>
        <div className="w-8 h-0.5 bg-[#C2A676] my-2" />

        <div className="flex items-center gap-3 my-2">
          <span className="text-xs uppercase tracking-wider text-[#7A7A7A]">Minggu</span>
          <span className="font-editors text-4xl text-[#2B2B2B]">28</span>
          <span className="text-xs uppercase tracking-wider text-[#7A7A7A]">Desember 2027</span>
        </div>

        <p className="font-poppins text-xs font-medium text-[#2B2B2B] mt-1">
          11.00 - 13.00 WIB
        </p>

        <div className="mt-4 text-xs text-[#5E5E5E] font-light">
          <p className="font-medium text-[#2B2B2B]">Menara 165</p>
          <p>Jl. TB Simatupang, Cilandak Timur, Jakarta Selatan</p>
        </div>

        <div className="mt-5 flex items-center gap-2.5 w-full">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-full bg-[#FAF8F5] border border-[#C2A676] text-[#2B2B2B] text-xs font-medium hover:bg-[#C2A676] hover:text-white transition-all text-center"
          >
            Google Maps
          </a>
          <button
            onClick={() => saveToCalendar("Resepsi Pernikahan Putri & Andika", "20271228T040000Z", "20271228T060000Z")}
            className="flex-1 py-2 px-3 rounded-full bg-[#2B2B2B] text-white text-xs font-medium hover:bg-[#444] transition-all text-center cursor-pointer"
          >
            Simpan Kalender
          </button>
        </div>
      </motion.div>
    </section>
  );
}
