"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Wish {
  id: string;
  name: string;
  attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu";
  message: string;
  createdAt: string;
}

export default function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: "1",
      name: "Rian & Dita",
      attendance: "Hadir",
      message: "Selamat Putri dan Andika! Semoga langgeng dan bahagia selamanya yaa.",
      createdAt: "Baru saja",
    },
    {
      id: "2",
      name: "Keluarga Besar Budi",
      attendance: "Hadir",
      message: "Barakallahu lakum wa baraka alaikum wa jama'a bainakuma fii khair.",
      createdAt: "1 jam lalu",
    },
    {
      id: "3",
      name: "Sahabat Kuliah",
      attendance: "Masih Ragu",
      message: "Happy wedding kalian berdua! Semoga lancar sampai hari H.",
      createdAt: "3 jam lalu",
    },
  ]);

  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"Hadir" | "Tidak Hadir" | "Masih Ragu">("Hadir");
  const [guestsCount, setGuestsCount] = useState("1");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: Date.now().toString(),
      name: name.trim(),
      attendance,
      message: message.trim(),
      createdAt: "Baru saja",
    };

    setWishes([newWish, ...wishes]);
    setName("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative w-full py-16 px-6 bg-[#FAF8F5] text-center flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-1"
      >
        <p className="font-analogue italic text-[#8E7D6B] text-lg tracking-[0.2em] uppercase">
          Ucapan & RSVP
        </p>
        <h2 className="font-editors text-2xl text-[#2B2B2B] tracking-wider uppercase">
          Buku Tamu
        </h2>
        <p className="text-xs text-[#5E5E5E] font-light mt-1">
          Berikan doa dan ucapan terbaik untuk kami.
        </p>
      </motion.div>

      {/* RSVP Form */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className="w-full max-w-[340px] bg-white/95 rounded-2xl p-5 shadow-sm border border-[#E8E2DA] flex flex-col gap-3 text-left"
      >
        <div>
          <label className="text-[11px] text-[#7A7A7A] uppercase font-light block mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:outline-none focus:border-[#C2A676] text-[#2B2B2B]"
          />
        </div>

        <div>
          <label className="text-[11px] text-[#7A7A7A] uppercase font-light block mb-1">
            Konfirmasi Kehadiran
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["Hadir", "Tidak Hadir", "Masih Ragu"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAttendance(opt)}
                className={`py-2 text-[10px] rounded-xl font-medium transition-colors border cursor-pointer ${
                  attendance === opt
                    ? "bg-[#2B2B2B] text-white border-[#2B2B2B]"
                    : "bg-[#FAF8F5] text-[#5E5E5E] border-[#E8E2DA]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] text-[#7A7A7A] uppercase font-light block mb-1">
            Jumlah Tamu
          </label>
          <select
            value={guestsCount}
            onChange={(e) => setGuestsCount(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:outline-none focus:border-[#C2A676] text-[#2B2B2B]"
          >
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
            <option value="3">3 Orang</option>
            <option value="4">4 Orang</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] text-[#7A7A7A] uppercase font-light block mb-1">
            Ucapan & Doa
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan doa & ucapan untuk kedua mempelai"
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:outline-none focus:border-[#C2A676] text-[#2B2B2B] resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#C2A676] to-[#A3895B] text-white text-xs font-medium uppercase tracking-wider shadow hover:brightness-105 active:scale-95 transition-all mt-2 cursor-pointer"
        >
          Kirim Ucapan
        </button>

        {submitted && (
          <p className="text-center text-xs text-emerald-600 font-medium mt-1">
            ✓ Terima kasih atas doa & ucapan Anda!
          </p>
        )}
      </motion.form>

      {/* Wishes List */}
      <div className="w-full max-w-[340px] flex flex-col gap-3">
        {wishes.map((w) => (
          <div
            key={w.id}
            className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#E8E2DA] flex flex-col text-left gap-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#2B2B2B]">{w.name}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full ${
                  w.attendance === "Hadir"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : w.attendance === "Tidak Hadir"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {w.attendance}
              </span>
            </div>
            <p className="text-xs text-[#5E5E5E] font-light leading-relaxed mt-1">
              {w.message}
            </p>
            <span className="text-[9px] text-[#A3A3A3] font-light mt-1">{w.createdAt}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
