"use client";
import React from "react";
import Image from "next/image";

export default function TreeShadowOverlay() {
  return (
    <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] h-screen overflow-hidden z-20">
      <div className="absolute top-0 left-0 w-full opacity-[0.14] animate-tree-sway">
        <Image
          src="/images/tree-shadow.png"
          alt="Tree shadow"
          width={700}
          height={540}
          className="w-full h-auto object-cover select-none"
          priority
        />
      </div>
    </div>
  );
}
