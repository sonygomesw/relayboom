"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-4xl mx-auto w-full gap-6 space-y-6">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex gap-6 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-48 w-48 md:h-20 md:w-20 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center md:text-left mb-2"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-lg"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-6 py-3 text-base rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-6 md:mt-0 transition-all duration-300"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Case Study",
    title: "Drake",
    src: "https://andscape.com/wp-content/uploads/2024/12/GettyImages-2182712179-e1733417329801.jpg?w=800",
    ctaText: "View Study",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <div>
          <div className="mb-4">
            <h4 className="font-bold text-lg mb-2">450M+ views in 30 days</h4>
            <p className="text-sm text-gray-600 mb-2">15,000+ videos published</p>
            <p className="text-sm text-green-600 font-medium">Verified ✓</p>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Viral Campaign with PartyNextDoor</h5>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">Leveraging our viral strategy, we contributed to massive Billboard success</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">300% increase in content engagement</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">8.5M+ new social media reach</p>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    description: "Case Study",
    title: "Mr Beast",
    src: "https://ichef.bbci.co.uk/ace/standard/1376/cpsprodpb/017d/live/8703abf0-2180-11ef-9628-ff2abcc9602e.jpg",
    ctaText: "View Study",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <div>
          <div className="mb-4">
            <h4 className="font-bold text-lg mb-2">700M+ views</h4>
            <p className="text-sm text-gray-600 mb-2">35,000+ videos published</p>
            <p className="text-sm text-green-600 font-medium">Verified ✓</p>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Content Strategy Analysis</h5>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">Applied similar strategies to achieve 2.5M subscriber growth</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">45% increase in engagement metrics</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">Record-breaking view counts across platforms</p>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    description: "Case Study",
    title: "Kai Cenat",
    src: "https://tnj.com/_next/image/?url=https%3A%2F%2Fcms.tnj.com%2Fwp-content%2Fuploads%2F2025%2F01%2FKai-Cenat-Net-Worth.webp&w=1920&q=75",
    ctaText: "View Study",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <div>
          <div className="mb-4">
            <h4 className="font-bold text-lg mb-2">280M+ views</h4>
            <p className="text-sm text-gray-600 mb-2">20,000+ videos published</p>
            <p className="text-sm text-green-600 font-medium">Verified ✓</p>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Platform Growth Strategy</h5>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">Implemented strategies leading to top streamer status</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">400% increase in content performance</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-sm">Multiple successful brand collaborations</p>
            </div>
          </div>
        </div>
      );
    },
  },
]; 