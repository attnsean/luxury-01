import React from "react";
import MainInvitation from "../components/MainInvitation";
import { headers } from "next/headers";
import { resolveProjectData } from "../../lib/resolveProject";
import type { Metadata } from "next";

export const revalidate = 0;

type Props = {
  params: Promise<{ name?: string[] }>;
  searchParams?: Promise<{ to?: string; guest?: string; u?: string; n?: string }>;
};

const formatFallbackGuestName = (raw: string): string => {
  let name = raw;
  try {
    name = decodeURIComponent(raw);
  } catch {}
  name = name
    .replace(/%20/g, " ")
    .replace(/%25/g, " ")
    .replace(/%/g, " ")
    .replace(/\+/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return name
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  let guestName = "Special Guest";
  const slug = resolvedParams?.name && resolvedParams.name.length > 0 ? resolvedParams.name[0] : undefined;

  const queryGuest = resolvedSearchParams?.to || resolvedSearchParams?.guest || resolvedSearchParams?.u || resolvedSearchParams?.n;
  if (queryGuest) {
    guestName = formatFallbackGuestName(queryGuest);
  } else if (resolvedParams?.name && resolvedParams.name.length > 0) {
    guestName = formatFallbackGuestName(resolvedParams.name.join(" "));
  }

  const headersList = await headers();
  const host = headersList.get("host") || undefined;

  const dbData = await resolveProjectData(slug, host, guestName);

  if (dbData.guest) {
    guestName = dbData.guest.name;
  }

  const brideName = dbData.project?.bride_nickname || "Putri";
  const groomName = dbData.project?.groom_nickname || "Andika";
  const brideFull = dbData.project?.bride_name || "Putri Cantika Sari";
  const groomFull = dbData.project?.groom_name || "Putra Andika Pratama";

  const title = `The Wedding of ${brideName} & ${groomName} | Undangan Pernikahan ${guestName}`;
  const description = `Kami mengundang ${guestName} untuk menghadiri perayaan pernikahan ${brideFull} & ${groomFull}.`;
  const imageUrl = dbData.project?.cover_photo_url || "/images/thumbnail.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: `${brideName} & ${groomName} Wedding`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `The Wedding of ${brideName} & ${groomName}`,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Home({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  let guestName = "Tamu Undangan";
  const slug = resolvedParams?.name && resolvedParams.name.length > 0 ? resolvedParams.name[0] : undefined;

  const queryGuest = resolvedSearchParams?.to || resolvedSearchParams?.guest || resolvedSearchParams?.u || resolvedSearchParams?.n;
  if (queryGuest) {
    guestName = formatFallbackGuestName(queryGuest);
  } else if (resolvedParams?.name && resolvedParams.name.length > 0) {
    guestName = formatFallbackGuestName(resolvedParams.name.join(" "));
  }

  const headersList = await headers();
  const host = headersList.get("host") || undefined;

  const dbData = await resolveProjectData(slug, host, guestName);

  if (dbData.guest) {
    guestName = dbData.guest.name;
  }

  const brideName = dbData.project?.bride_nickname || "Putri";
  const groomName = dbData.project?.groom_nickname || "Andika";
  const brideFullName = dbData.project?.bride_name || "Putri Cantika Sari";
  const groomFullName = dbData.project?.groom_name || "Putra Andika Pratama";
  const weddingDate = dbData.project?.wedding_date || "28 . 12 . 2027";
  const musicUrl = dbData.project?.music_url || "/audio/song.mp3";

  return (
    <MainInvitation
      guestName={guestName}
      brideName={brideName}
      groomName={groomName}
      brideFullName={brideFullName}
      groomFullName={groomFullName}
      weddingDate={weddingDate}
      musicUrl={musicUrl}
    />
  );
}
