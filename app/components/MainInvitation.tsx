"use client";
import React, { useState } from "react";
import CoverModal from "./CoverModal";
import TreeShadowOverlay from "./TreeShadowOverlay";
import AudioPlayer from "./AudioPlayer";
import HeroSection from "./HeroSection";
import QuoteSection from "./QuoteSection";
import CoupleSection from "./CoupleSection";
import EventSection from "./EventSection";
import LiveStreamingSection from "./LiveStreamingSection";
import DresscodeSection from "./DresscodeSection";
import LoveStorySection from "./LoveStorySection";
import GallerySection from "./GallerySection";
import GiftSection from "./GiftSection";
import WishesSection from "./WishesSection";
import FooterSection from "./FooterSection";

interface MainInvitationProps {
  guestName: string;
  brideName?: string;
  groomName?: string;
  brideFullName?: string;
  groomFullName?: string;
  weddingDate?: string;
  musicUrl?: string;
}

export default function MainInvitation({
  guestName,
  brideName = "Putri",
  groomName = "Andika",
  brideFullName = "Putri Cantika Sari",
  groomFullName = "Putra Andika Pratama",
  weddingDate = "28 . 12 . 2027",
  musicUrl = "/audio/song.mp3",
}: MainInvitationProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleOpen = () => {
    setIsUnlocked(true);
    // Smooth scroll down slightly after unlock
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="relative w-full bg-[#FAF8F5] text-[#5E5E5E] min-h-screen">
      {/* Floating natural tree shadow overlay with sway animation */}
      <TreeShadowOverlay />

      {/* Floating audio vinyl player */}
      <AudioPlayer musicUrl={musicUrl} autoPlay={isUnlocked} />

      {/* Opening Cover Modal */}
      <CoverModal
        guestName={guestName}
        brideName={brideName}
        groomName={groomName}
        onOpen={handleOpen}
      />

      {/* Main Invitation Sections */}
      <div className={isUnlocked ? "opacity-100 transition-opacity duration-1000" : "h-screen overflow-hidden"}>
        <HeroSection
          brideName={brideName}
          groomName={groomName}
          weddingDate={weddingDate}
        />

        <QuoteSection />

        <CoupleSection
          bride={{
            name: brideName,
            fullName: brideFullName,
            order: "Putri Pertama dari",
            father: "Bapak Abdul Rozak",
            mother: "Ibu Adelia Marni",
            photoUrl: "/images/bride-photo.jpg",
            instagram: "putricantika",
          }}
          groom={{
            name: groomName,
            fullName: groomFullName,
            order: "Putra Pertama dari",
            father: "Bapak Deni Bastian",
            mother: "Ibu Aisha Dania",
            photoUrl: "/images/groom-photo.jpg",
            instagram: "andikapratama",
          }}
        />

        <EventSection
          weddingDate={weddingDate}
          targetDate="2027-12-28T08:00:00"
        />

        <LiveStreamingSection />

        <DresscodeSection />

        <LoveStorySection />

        <GallerySection />

        <GiftSection />

        <WishesSection />

        <FooterSection
          brideName={brideName}
          groomName={groomName}
        />
      </div>
    </div>
  );
}
