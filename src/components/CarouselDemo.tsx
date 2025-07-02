"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function CarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full pt-2 pb-12">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 font-sans mb-4">
        Nos créateurs partenaires
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700">
                Rejoins des milliers de clippeurs qui gagnent déjà de l'argent.
              </span>{" "}
              Crée des clips TikTok percutants pour tes streamers préférés et monétise ta créativité dès aujourd'hui.
            </p>
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Gaming",
    title: "Kameto",
    src: "/kaicenatfan.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming",
    title: "Solary",
    src: "/speedfan.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming", 
    title: "Gotaga",
    src: "/drakefan.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming",
    title: "Squeezie",
    src: "/mrbeast.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming",
    title: "Locklear",
    src: "/tatefan.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming",
    title: "Domingo",
    src: "/hormozifan.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming",
    title: "Lebouseuh",
    src: "/traviscottfan.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gaming",
    title: "Michou",
    src: "/keinemusikfan.jpg",
    content: <DummyContent />,
  },
]; 