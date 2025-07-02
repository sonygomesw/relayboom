"use client";

import React from "react";
import { VideoCarousel, VideoCard } from "@/components/ui/video-cards-carousel";
import { IconFlame, IconCoin } from '@tabler/icons-react';

export default function VideoCarouselDemo() {
  const cards = videoData.map((card, index) => (
    <VideoCard key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full pt-2 pb-12 bg-gray-50">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 font-sans mb-4">
        Clips en action
      </h2>
      <VideoCarousel items={cards} />
    </div>
  );
}

const VideoContent = ({ title, description, stats }: { title: string; description: string; stats: string }) => {
  return (
    <>
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <h3 className="text-neutral-800 text-xl md:text-3xl font-bold mb-4">
          {title}
        </h3>
        <p className="text-neutral-600 text-base md:text-xl font-sans max-w-3xl mx-auto mb-6">
          {description}
        </p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-2">
            <IconFlame className="w-4 h-4" />
            <span>{stats.split('•')[0].trim()}</span>
            <span>•</span>
            <IconCoin className="w-4 h-4" />
            <span>{stats.split('•')[1].trim()}</span>
          </span>
        </div>
        <div className="mt-6 text-center">
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Voir plus de clips similaires
          </button>
        </div>
      </div>
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl">
        <p className="text-neutral-600 text-base md:text-xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            Ce type de clip peut te rapporter entre 50€ et 200€
          </span>{" "}
          selon les vues générées. Plus ton clip est viral, plus tu gagnes !
        </p>
      </div>
    </>
  );
};

const videoData = [
  {
    category: "YouTube",
    title: "MrBeast Challenge",
    src: "/video/mrbeast.mp4",
    isVideo: true,
    content: <VideoContent 
      title="Clip MrBeast - Défi impossible"
      description="Un moment épique d'un défi MrBeast où l'action est tellement intense qu'elle est parfaite pour un clip TikTok viral."
      stats="2.3M vues • 180€ gagnés"
    />,
  },
  {
    category: "Streaming",
    title: "Kai Cenat Reaction",
    src: "/video/kaicenat.mp4",
    isVideo: true,
    content: <VideoContent 
      title="Réaction explosive de Kai Cenat"
      description="Kai Cenat qui explose de rire face à une situation complètement folle. Ces moments authentiques fonctionnent très bien sur TikTok."
      stats="1.8M vues • 140€ gagnés"
    />,
  },
  {
    category: "Gaming",
    title: "Speed Gaming Rage",
    src: "/video/speed.mp4",
    isVideo: true,
    content: <VideoContent 
      title="Speed en mode rage épique"
      description="Speed qui rage complètement après un fail dans le jeu. Ces moments de rage pure sont parfaits pour les clips TikTok."
      stats="3.1M vues • 250€ gagnés"
    />,
  },
]; 