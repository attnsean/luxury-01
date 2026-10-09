"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection() {
  const images = [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
  ];

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

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
          Gallery
        </p>
        <h2 className="font-editors text-2xl text-[#2B2B2B] tracking-wider uppercase">
          Our Moments
        </h2>
      </motion.div>

      {/* Grid */}
      <div className="w-full max-w-[360px] grid grid-cols-2 gap-3">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            onClick={() => setActiveIdx(i)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow ${i === 0 ? "col-span-2 h-56" : "h-44"}`}
          >
            <Image
              src={src}
              alt={`Gallery ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setActiveIdx(null)}
          >
            <div
              className="relative max-w-lg w-full h-[70vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIdx]}
                alt="Selected photo"
                fill
                className="object-contain"
              />

              {/* Close Button */}
              <button
                onClick={() => setActiveIdx(null)}
                className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>

              {/* Prev Button */}
              <button
                onClick={() => setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={() => setActiveIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
